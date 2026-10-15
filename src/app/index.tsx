import { AntDesign } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { api } from '../services/api';
import { decodeGoogleToken, saveUser } from '../services/authStorage';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

WebBrowser.maybeCompleteAuthSession({ skipRedirectCheck: true });

if (Platform.OS !== 'web') {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
}

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const hash = window.location.hash || window.location.search;
      if (hash && (hash.includes('id_token=') || hash.includes('&id_token='))) {
        const params = new URLSearchParams(hash.replace(/^[#?]/, ''));
        const token = params.get('id_token');
        if (token) {
          if (typeof window !== 'undefined' && window.history) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          setLoading(true);
          setMensagemStatus('Validando acesso...');
          api.post('/auth/google/id-token', { idToken: token })
            .then((res) => {
              const googleData = decodeGoogleToken(token);
              const backendData = res?.data || {};
              saveUser({
                name: backendData.name || backendData.user?.name || googleData.name || 'Usuário',
                email: backendData.email || backendData.user?.email || googleData.email || '',
                picture: backendData.picture || backendData.user?.picture || googleData.picture,
                role: (backendData.role === 'USER' || backendData.perfil === 'USER') ? 'USER' : 'ADMIN',
              });
              router.replace('/materiais');
            })
            .catch((err) => {
              console.warn('Erro ao autenticar token da URL:', err);
              setMensagemStatus('Falha ao autenticar: ' + (err?.response?.data?.message || err?.message));
              setLoading(false);
            });
        }
      }
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setMensagemStatus('Conectando com o Google...');
      let idToken: string | null | undefined = null;

      if (Platform.OS === 'web') {
        const redirectUri = AuthSession.makeRedirectUri();
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID}` +
          `&response_type=id_token` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&scope=openid%20email%20profile` +
          `&nonce=default_nonce` +
          `&prompt=select_account`;

        const response = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

        if (response.type === 'success' && response.url) {
          const urlParams = new URLSearchParams(
            response.url.split('#')[1] || response.url.split('?')[1]
          );
          idToken = urlParams.get('id_token');
        } else if (response.type !== 'cancel' && response.type !== 'dismiss') {
          setMensagemStatus('Aviso: Login não concluído (' + response.type + ')');
          setLoading(false);
          return;
        } else {
          setMensagemStatus('Janela fechada pelo usuário.');
          setLoading(false);
          return;
        }
      } else {
        await GoogleSignin.hasPlayServices();
        try {
          await GoogleSignin.signOut();
        } catch {}
        const userInfo = await GoogleSignin.signIn();
        idToken = userInfo.data?.idToken;
      }

      if (!idToken) {
        setMensagemStatus('Não foi possível obter o token do Google.');
        setLoading(false);
        return;
      }

      setMensagemStatus('Validando no servidor...');
      const res = await api.post('/auth/google/id-token', {
        idToken: idToken
      });

      const googleData = decodeGoogleToken(idToken);
      const backendData = res?.data || {};

      saveUser({
        name: backendData.name || backendData.user?.name || googleData.name || 'Usuário',
        email: backendData.email || backendData.user?.email || googleData.email || '',
        picture: backendData.picture || backendData.user?.picture || googleData.picture,
        role: (backendData.role === 'USER' || backendData.perfil === 'USER') ? 'USER' : 'ADMIN',
      });

      setMensagemStatus('Sucesso! Entrando...');
      router.replace('/materiais');

    } catch (error: any) {
      console.warn('Erro na autenticação:', error?.response?.status, error?.message);
      
      let mensagem = 'Falha ao conectar no servidor.';
      if (typeof error?.response?.data === 'string' && error.response.data.length > 0) {
        mensagem = error.response.data;
      } else if (error?.response?.data?.message) {
        mensagem = error.response.data.message;
      } else if (error?.response?.status) {
        mensagem = `Erro no servidor (${error.response.status})`;
      } else if (error?.message) {
        mensagem = error.message;
      }

      setMensagemStatus(mensagem);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.cardContainer}>
        <View style={styles.iconContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9468/9468324.png' }} 
            style={{ width: 65, height: 65 }} 
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Gestão de Patrimônio</Text>
        <Text style={styles.subtitle}>Acesse o sistema com sua conta corporativa para gerenciar equipamentos</Text>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={[styles.googleButton, loading && { opacity: 0.7 }]} 
          onPress={handleGoogleLogin} 
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" style={styles.googleIcon} />
          ) : (
            <AntDesign name="google" size={22} color="#ffffff" style={styles.googleIcon} />
          )}
          <Text style={styles.googleButtonText}>
            {loading ? 'Aguarde...' : 'Entrar com o Google'}
          </Text>
        </TouchableOpacity>

        {mensagemStatus && (
          <Text style={{ marginTop: 15, fontSize: 13, color: '#64748b', textAlign: 'center' }}>
            {mensagemStatus}
          </Text>
        )}

        <Text style={styles.footerText}>Versão 1.0.0</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  iconContainer: {
    width: 90,
    height: 90,
    backgroundColor: '#eff6ff',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 30,
  },
  googleButton: {
    backgroundColor: '#0f172a',
    width: '100%',
    height: 55,
    borderRadius: 12,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  googleIcon: {
    marginRight: 12, 
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  footerText: {
    marginTop: 35,
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '600',
  }
});