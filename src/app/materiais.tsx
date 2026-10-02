import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../supabase';

type Patrimonio = {
  id: string;
  nome: string; 
  tombamento: string;
  setor: string;
};

export default function ListagemScreen() {
  const [bens, setBens] = useState<Patrimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    carregarPatrimonio();
  }, []);

  const carregarPatrimonio = async () => {
    try {
      const { data, error } = await supabase
        .from('patrimonio')
        .select('*');

      if (error) throw error;
      setBens(data || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os registos.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      
      router.replace('/');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível terminar a sessão.');
    }
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bens Patrimoniais</Text>
        
        <View style={styles.headerButtons}>
          {/* Botão de Logout atualizado com texto */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
            <AntDesign name="logout" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addButton}>
            <AntDesign name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
          <Text style={styles.loadingText}>A carregar dados...</Text>
        </View>
      ) : (
        <FlatList
          data={bens}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.nome || 'Sem nome'}</Text>
                <Text style={styles.cardSubtitle}>Nº Tombamento: {item.tombamento || 'N/A'}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.setor || 'Sem setor'}</Text>
                </View>
              </View>
              <AntDesign name="right" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum material registado na base de dados.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    backgroundColor: '#1e3a8a', 
    paddingTop: 50, 
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  addButton: { 
    backgroundColor: '#3b82f6', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  listContainer: { padding: 15 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 8 },
  badge: { backgroundColor: '#e0e7ff', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, alignSelf: 'flex-start' },
  badgeText: { color: '#1e3a8a', fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 50, fontSize: 16 },
});