import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// TODO: Remover isso quando a rota /patrimonios for criada no backend Java
const DADOS_MOCKADOS = [
  { id: '1', nome: 'Monitor de Sinais Vitais Philips', tombamento: '2023001', setor: 'UTI Adulto', status: 'Ativo', categoria: 'Equipamento Médico', responsavel: 'Dr. Renato Silva' },
  { id: '2', nome: 'Cadeira de Rodas Dobrável', tombamento: '2023002', setor: 'Pronto Socorro', status: 'Em Manutenção', categoria: 'Mobiliário', responsavel: 'Enf. Carlos Almeida' },
  { id: '3', nome: 'Maca Hospitalar Articulada', tombamento: '2023003', setor: 'Enfermaria Pediátrica', status: 'Ativo', categoria: 'Mobiliário', responsavel: 'Dra. Mariana Costa' },
  { id: '4', nome: 'Desfibrilador Externo Automático', tombamento: '2023004', setor: 'Ambulatório', status: 'Baixado', categoria: 'Equipamento Médico', responsavel: 'Sem responsável' },
];

const CATEGORIAS = ['Todos', 'Equipamento Médico', 'Mobiliário', 'Informática'];

export default function ListagemScreen() {
  // LÓGICA DE PERFIL (Simulando a resposta do Backend)
  const [perfil, setPerfil] = useState<'ADMIN' | 'USER'>('ADMIN');
  const usuarioLogado = 'Dr. Renato Silva'; // Simulando quem é a pessoa logada

  const [bens, setBens] = useState(DADOS_MOCKADOS);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const router = useRouter();

  const handleLogout = async () => {
    router.replace('/');
  };

  const togglePerfil = () => {
    setPerfil(prev => prev === 'ADMIN' ? 'USER' : 'ADMIN');
  };

  // Lógica de Filtro
  const bensFiltrados = bens.filter((item) => {
    // 2. Filtros normais da tela
    const bateBusca = item.nome.toLowerCase().includes(busca.toLowerCase()) || 
                      item.tombamento.includes(busca) || 
                      item.responsavel.toLowerCase().includes(busca.toLowerCase());
    const bateCategoria = categoriaAtiva === 'Todos' || item.categoria === categoriaAtiva;
    
    return bateBusca && bateCategoria;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return { bg: '#dcfce7', text: '#166534' };
      case 'Em Manutenção': return { bg: '#fef08a', text: '#854d0e' };
      case 'Baixado': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#e2e8f0', text: '#475569' };
    }
  };

  const getIconeCategoria = (categoria: string) => {
    switch (categoria) {
      case 'Informática': return 'laptop';
      case 'Mobiliário': return 'wheelchair-pickup';
      case 'Equipamento Médico': return 'monitor-heart';
      default: return 'inventory';
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Bens Patrimoniais</Text>
          <Text style={styles.headerSubtitle}>
            {perfil === 'ADMIN' ? 'Visão: Administrador (Pode Editar)' : `Visão: Leitura (Apenas Consulta)`}
          </Text>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: perfil === 'ADMIN' ? '#22c55e' : '#f59e0b' }]} 
            onPress={togglePerfil}
          >
            <Feather name="shield" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => router.push('/movimentacoes')}
          >
            <Feather name="repeat" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <AntDesign name="logout" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar bem, tombamento ou responsável..."
            placeholderTextColor="#94a3b8"
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <AntDesign name="close-circle" size={16} color="#cbd5e1" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* FILTROS DE CATEGORIA (SCROLL HORIZONTAL) */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, categoriaAtiva === cat && styles.filterChipActive]}
              onPress={() => setCategoriaAtiva(cat)}
            >
              <Text style={[styles.filterText, categoriaAtiva === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LISTAGEM */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
          <Text style={styles.loadingText}>Carregando inventário...</Text>
        </View>
      ) : (
        <FlatList
          data={bensFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const statusStyle = getStatusColor(item.status);
            return (
              <TouchableOpacity 
                style={styles.card} 
                activeOpacity={0.7}
                onPress={() => router.push(`/detalhes/${item.id}`)}
              >
                <View style={styles.cardIconWrapper}>
                  <MaterialIcons name={getIconeCategoria(item.categoria) as any} size={28} color="#1e3a8a" />
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.cardSubtitle}>Nº Tombamento: <Text style={styles.tombamentoBold}>{item.tombamento}</Text></Text>
                  </View>

                  <View style={styles.responsavelRow}>
                    <Feather name="user" size={14} color="#64748b" />
                    <Text style={styles.responsavelText}>{item.responsavel}</Text>
                  </View>

                  <View style={styles.badgesRow}>
                    <View style={styles.sectorBadge}>
                      <Feather name="map-pin" size={12} color="#64748b" />
                      <Text style={styles.sectorText}>{item.setor}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                    </View>
                  </View>
                </View>
                <AntDesign name="right" size={20} color="#cbd5e1" />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Nenhum material encontrado.</Text>
            </View>
          }
        />
      )}

      {/* BOTÃO FLUTUANTE DE ADICIONAR SÓ APARECE PARA ADMIN */}
      {perfil === 'ADMIN' && (
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    backgroundColor: '#1e3a8a', 
    paddingTop: 60, 
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: '#93c5fd', fontSize: 13, fontWeight: '600', marginTop: 2 },
  headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 20,
  },
  logoutText: { color: '#fff', fontSize: 14, fontWeight: '700', marginRight: 6 },
  
  searchContainer: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchInputWrapper: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  clearIcon: { marginLeft: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#334155' },

  filtersContainer: { marginTop: 15, marginBottom: 5 },
  filtersScroll: { paddingHorizontal: 20, gap: 10 },
  filterChip: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: { backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' },
  filterText: { color: '#64748b', fontWeight: '600', fontSize: 14 },
  filterTextActive: { color: '#ffffff' },

  listContainer: { padding: 20, paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, color: '#64748b', fontSize: 16, fontWeight: '600' },
  
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 5 
  },
  cardIconWrapper: {
    width: 54,
    height: 54,
    backgroundColor: '#f1f5f9',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#64748b' },
  tombamentoBold: { fontWeight: '700', color: '#475569' },
  
  responsavelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 4 },
  responsavelText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectorBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f5f9', 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 6 
  },
  sectorText: { color: '#64748b', fontSize: 12, fontWeight: '600', marginLeft: 4 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: '700' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 16, fontSize: 16, fontWeight: '600' },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3b82f6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});