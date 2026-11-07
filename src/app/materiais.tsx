import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { AppLayout } from '../components/AppLayout';
import { getUser, updateUserRole } from '../services/authStorage';
import { BemPatrimonial, obterTodosPatrimonios, sincronizarPatrimoniosComBanco } from '../services/patrimonioService';

const CATEGORIAS = ['Todos', 'Informática', 'Equipamentos de Saúde', 'Mobiliário', 'Climatização e Apoio'];

export default function ListagemScreen() {
  const [perfil, setPerfil] = useState<'ADMIN' | 'USER'>(() => getUser().role || 'ADMIN');
  const [bens, setBens] = useState<BemPatrimonial[]>(() => obterTodosPatrimonios());
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const router = useRouter();

  useEffect(() => {
    sincronizarPatrimoniosComBanco().then((dados) => {
      setBens(dados);
    });

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const recarregar = () => {
        const u = getUser();
        setPerfil(u.role || 'ADMIN');
        setBens(obterTodosPatrimonios());
        sincronizarPatrimoniosComBanco().then((dados) => setBens(dados));
      };
      window.addEventListener('focus', recarregar);
      return () => window.removeEventListener('focus', recarregar);
    }
  }, []);

  const togglePerfil = () => {
    const novo = perfil === 'ADMIN' ? 'USER' : 'ADMIN';
    setPerfil(novo);
    updateUserRole(novo);
  };

  const bensFiltrados = bens.filter((item) => {
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
      case 'Informática': return 'computer';
      case 'Equipamentos de Saúde': return 'medical-services';
      case 'Mobiliário': return 'meeting-room';
      case 'Climatização e Apoio': return 'ac-unit';
      default: return 'inventory';
    }
  };

  return (
    <AppLayout
      rotaAtiva="materiais"
      titulo="Consulta de Materiais"
      subtitulo="Inventário e Rastreabilidade • SMS Diadema"
    >
      <View style={styles.container}>
        <View style={styles.inventoryToolbar}>
          <View style={styles.inventoryStatsRow}>
            <Text style={styles.inventoryCountText}>
              <Text style={{ fontWeight: '800', color: '#0f172a' }}>{bensFiltrados.length}</Text>{' '}
              {bensFiltrados.length === 1 ? 'patrimônio cadastrado' : 'patrimônios cadastrados'}
            </Text>
            <TouchableOpacity 
              style={[styles.badgePerfil, { backgroundColor: perfil === 'ADMIN' ? '#22c55e' : '#f59e0b' }]} 
              onPress={togglePerfil}
              activeOpacity={0.8}
            >
              <Feather name="shield" size={12} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.badgePerfilText}>
                {perfil === 'ADMIN' ? 'Modo Admin' : 'Modo Consulta'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar bem ou nº de tombamento..."
            placeholderTextColor="#94a3b8"
            value={busca}
            onChangeText={setBusca}
            accessible={true}
            accessibilityLabel="Buscar bem por nome, tombamento ou responsável"
            accessibilityHint="Digite termos de pesquisa para filtrar a lista"
          />
          {busca.length > 0 && (
            <TouchableOpacity 
              onPress={() => setBusca('')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Limpar texto da busca"
            >
              <AntDesign name="close-circle" size={16} color="#cbd5e1" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, categoriaAtiva === cat && styles.filterChipActive]}
              onPress={() => setCategoriaAtiva(cat)}
              accessible={true}
              accessibilityRole="tab"
              accessibilityLabel={`Filtrar por categoria ${cat}`}
              accessibilityState={{ selected: categoriaAtiva === cat }}
            >
              <Text style={[styles.filterText, categoriaAtiva === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Patrimônio ${item.nome}, tombamento ${item.tombamento}, status ${item.status}, setor ${item.setor}, responsável ${item.responsavel}`}
                accessibilityHint="Toque para visualizar detalhes e ficha técnica"
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
                    <Feather
                      name={item.responsavel === 'Não atribuído' ? 'user-x' : 'user-check'}
                      size={13}
                      color={item.responsavel === 'Não atribuído' ? '#94a3b8' : '#166534'}
                    />
                    <Text
                      style={[
                        styles.responsavelText,
                        item.responsavel === 'Não atribuído'
                          ? { color: '#94a3b8', fontStyle: 'italic' }
                          : { color: '#166534', fontWeight: '700' },
                      ]}
                    >
                      {item.responsavel}
                    </Text>
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

      {perfil === 'ADMIN' && (
        <TouchableOpacity 
          style={styles.fab} 
          activeOpacity={0.8}
          onPress={() => router.push('/novo-patrimonio' as any)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Cadastrar novo patrimônio municipal"
        >
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  inventoryToolbar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  inventoryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inventoryCountText: {
    fontSize: 14,
    color: '#64748b',
  },
  badgePerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  badgePerfilText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  
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