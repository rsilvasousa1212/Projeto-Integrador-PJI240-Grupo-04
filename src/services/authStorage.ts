import { Platform } from 'react-native';

export interface UserProfile {
  name: string;
  email: string;
  picture?: string;
  role: 'ADMIN' | 'USER';
}

const STORAGE_KEY = '@epatrimonio_user';

let memoryUser: UserProfile | null = null;

function decodeBase64(str: string): string {
  if (typeof atob === 'function') {
    return atob(str);
  }
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  const cleanStr = String(str).replace(/=+$/, '');
  if (cleanStr.length % 4 === 1) {
    throw new Error('Base64 inválido');
  }
  for (let bc = 0, bs = 0, buffer, idx = 0; (buffer = cleanStr.charAt(idx++)); ) {
    const charIndex = chars.indexOf(buffer);
    if (~charIndex) {
      bs = bc % 4 ? bs * 64 + charIndex : charIndex;
      if (bc++ % 4) {
        output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
      }
    }
  }
  return output;
}

export function decodeGoogleToken(idToken: string): Partial<UserProfile> {
  try {
    const parts = idToken.split('.');
    if (parts.length < 2) return {};
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const raw = decodeBase64(base64);
    const jsonStr = decodeURIComponent(
      raw
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonStr);
    return {
      name: payload.name || payload.given_name || 'Usuário',
      email: payload.email || '',
      picture: payload.picture || undefined,
    };
  } catch (e) {
    console.warn('Falha ao decodificar token:', e);
    return {};
  }
}

export const saveUser = (user: UserProfile) => {
  memoryUser = user;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {}
  }
};

export const getUser = (): UserProfile => {
  if (memoryUser) return memoryUser;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        memoryUser = JSON.parse(saved);
        if (memoryUser) return memoryUser;
      }
    } catch {}
  }
  return {
    name: 'Servidor Municipal',
    email: 'gestao.patrimonio@saude.diadema.sp.gov.br',
    role: 'ADMIN',
  };
};

export const updateUserRole = (role: 'ADMIN' | 'USER'): UserProfile => {
  const current = getUser();
  const updated: UserProfile = { ...current, role };
  saveUser(updated);
  return updated;
};

export const clearUser = () => {
  memoryUser = null;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
};
