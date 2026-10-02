import { AntDesign } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
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

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
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
        const idToken = urlParams.get('id_token');

        if (!idToken) {
          Alert.alert('Erro', 'Falha ao autenticar.');
          return;
        }

        const apiResponse = await api.post('/auth/google/id-token', {
          idToken: idToken
        });

        // Salvar token retornado pela API futuramente aqui
        // const { accessToken } = apiResponse.data;

        router.replace('/materiais');
      } else if (response.type !== 'cancel') {
         Alert.alert('Aviso', 'O login não foi concluído.');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Erro', 
        error?.response?.data?.message || 'Falha ao conectar no servidor.'
      );
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
        <Text style={styles.subtitle}>Acesse o sistema com sua conta corporativa para gerenciar equipamentos e setores.</Text>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} activeOpacity={0.8}>
          <AntDesign name="google" size={22} color="#DB4437" style={styles.googleIcon} />
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
    backgroundColor: '#ffffff',
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
    color: '#334155',
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