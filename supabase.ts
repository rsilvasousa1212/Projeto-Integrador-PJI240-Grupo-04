import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Lendo as chaves diretamente do arquivo .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);