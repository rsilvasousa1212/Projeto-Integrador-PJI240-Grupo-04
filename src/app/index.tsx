import { AntDesign } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import {
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

import { GoogleSignin } from '@react-native-google-signin/google-signin';

WebBrowser.maybeCompleteAuthSession({ skipRedirectCheck: true });

if (Platform.OS !== 'web') {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
}

export default function LoginScreen() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const hash = window.location.hash || window.location.search;
      if (hash && (hash.includes('id_token=') || hash.includes('&id_token='))) {
        const params = new URLSearchParams(hash.replace(/^[#?]/, ''));
        const token = params.get('id_token');
        if (token) {
          api.post('/auth/google/id-token', { idToken: token })
            .then(() => {
              router.replace('/materiais');
            })
            .catch((err) => {
              console.warn('Erro ao autenticar token da URL:', err);
            });
        }
      }
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      let idToken: string | null | undefined = null;

      if (Platform.OS === 'web') {
        const redirectUri = AuthSession.makeRedirectUri();
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID}` +
          `&response_type=id_token` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&scope=openid%20email%20profile` +
          `&nonce=default_nonce`;

        const response = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

        if (response.type === 'success' && response.url) {
          const urlParams = new URLSearchParams(
            response.url.split('#')[1] || response.url.split('?')[1]
          );
          idToken = urlParams.get('id_token');
        } else if (response.type !== 'cancel') {
          Alert.alert('Aviso', 'O login não foi concluído.');
          return;
        } else {
          return;
        }
      } else {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        idToken = userInfo.data?.idToken;
      }

      if (!idToken) {
        Alert.alert('Erro', 'Falha ao recuperar o token do Google.');
        return;
      }

      await api.post('/auth/google/id-token', {
        idToken: idToken
      });

      router.replace('/materiais');

    } catch (error: any) {
      console.warn('Erro na autenticação:', error?.response?.status, error?.message);
      
      let mensagem = 'Falha ao conectar no servidor.';
      if (error?.response?.status === 503) {
        mensagem = 'O servidor está temporariamente indisponível. Tente novamente em instantes.';
      } else if (error?.response?.data?.message) {
        mensagem = error.response.data.message;
      } else if (error?.message) {
        mensagem = error.message;
      }

      Alert.alert('Erro de Conexão', mensagem);
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

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} activeOpacity={0.8}>
          <AntDesign name="google" size={22} color="#ffffff" style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Entrar com o Google</Text>
        </TouchableOpacity>

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