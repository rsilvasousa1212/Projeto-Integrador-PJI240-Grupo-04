import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { clearUser, getUser, updateUserRole, UserProfile } from '../services/authStorage';

const DADOS_PATRIMONIOS = [
  { id: '1', nome: 'Monitor de Sinais Vitais Philips', tombamento: '2023001', setor: 'UTI Adulto', status: 'Ativo', categoria: 'Equipamento Médico', responsavel: 'Não atribuído' },
  { id: '2', nome: 'Cadeira de Rodas Dobrável', tombamento: '2023002', setor: 'Pronto Socorro', status: 'Em Manutenção', categoria: 'Mobiliário', responsavel: 'Não atribuído' },
  { id: '3', nome: 'Maca Hospitalar Articulada', tombamento: '2023003', setor: 'Enfermaria Pediátrica', status: 'Ativo', categoria: 'Mobiliário', responsavel: 'Não atribuído' },
  { id: '4', nome: 'Desfibrilador Externo Automático', tombamento: '2023004', setor: 'Ambulatório', status: 'Baixado', categoria: 'Equipamento Médico', responsavel: 'Não atribuído' },
];

const CATEGORIAS = ['Todos', 'Equipamento Médico', 'Mobiliário', 'Informática'];

export default function ListagemScreen() {
  const [usuario, setUsuario] = useState<UserProfile>(getUser());
  const [perfil, setPerfil] = useState<'ADMIN' | 'USER'>(usuario.role || 'ADMIN');
  const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);
  const [bens, setBens] = useState(DADOS_PATRIMONIOS);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    setUsuario(u);
    setPerfil(u.role || 'ADMIN');
  }, []);

  const handleLogout = async () => {
    clearUser();
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', '/');
    }
    router.replace('/');
  };

  const togglePerfil = () => {
    const novo = perfil === 'ADMIN' ? 'USER' : 'ADMIN';
    setPerfil(novo);
    const updated = updateUserRole(novo);
    setUsuario(updated);
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
      case 'Informática': return 'laptop';
      case 'Mobiliário': return 'wheelchair-pickup';
      case 'Equipamento Médico': return 'monitor-heart';
      default: return 'inventory';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userBar}>
          <TouchableOpacity 
            style={styles.userProfileButton} 
            activeOpacity={0.7}
            onPress={() => setModalPerfilVisivel(true)}
          >
            {usuario.picture ? (
              <Image source={{ uri: usuario.picture }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {usuario.name ? usuario.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}

            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>{usuario.name}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{usuario.email}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.badgePerfil, { backgroundColor: perfil === 'ADMIN' ? '#22c55e' : '#f59e0b' }]} 
              onPress={togglePerfil}
              activeOpacity={0.8}
            >
              <Feather name="shield" size={13} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.badgePerfilText}>
                {perfil === 'ADMIN' ? 'Admin' : 'Consulta'}
              </Text>
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

        <View style={styles.titleSection}>
          <Text style={styles.headerTitle}>Bens Patrimoniais</Text>
          <Text style={styles.headerSubtitle}>
            {perfil === 'ADMIN' 
              ? 'Controle de Ativos Hospitalares • Modo Administrador' 
              : 'Consulta e Rastreabilidade de Bens • Somente Leitura'}
          </Text>
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
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
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
            >
              <Text style={[styles.filterText, categoriaAtiva === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
                    <Feather name="user" size={13} color="#94a3b8" />
                    <Text style={[styles.responsavelText, { color: '#94a3b8', fontStyle: 'italic' }]}>
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
      )}

      {perfil === 'ADMIN' && (
        <TouchableOpacity 
          style={styles.fab} 
          activeOpacity={0.8}
          onPress={() => router.push('/novo-patrimonio' as any)}
        >
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <Modal
        visible={modalPerfilVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalPerfilVisivel(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalPerfilVisivel(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Identificação do Usuário</Text>
              <TouchableOpacity onPress={() => setModalPerfilVisivel(false)}>
                <AntDesign name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {usuario.picture ? (
                <Image source={{ uri: usuario.picture }} style={styles.modalAvatarImage} />
              ) : (
                <View style={styles.modalAvatarFallback}>
                  <Text style={styles.modalAvatarInitial}>
                    {usuario.name ? usuario.name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
              )}

              <Text style={styles.modalUserName}>{usuario.name}</Text>
              <Text style={styles.modalUserEmail}>{usuario.email}</Text>

              <View style={[styles.modalPerfilTag, { backgroundColor: perfil === 'ADMIN' ? '#dcfce7' : '#fef3c7' }]}>
                <Feather 
                  name={perfil === 'ADMIN' ? 'shield' : 'eye'} 
                  size={15} 
                  color={perfil === 'ADMIN' ? '#166534' : '#92400e'} 
                />
                <Text style={[styles.modalPerfilTagText, { color: perfil === 'ADMIN' ? '#166534' : '#92400e' }]}>
                  {perfil === 'ADMIN' ? 'Perfil: Administrador' : 'Perfil: Operador / Consulta'}
                </Text>
              </View>

              <View style={styles.permissoesContainer}>
                <Text style={styles.permissoesTitle}>Permissões concedidas no sistema:</Text>
                
                <View style={styles.permissaoItem}>
                  <Feather name="check-circle" size={15} color="#16a34a" />
                  <Text style={styles.permissaoText}>Visualizar inventário de materiais</Text>
                </View>
                
                <View style={styles.permissaoItem}>
                  <Feather name="check-circle" size={15} color="#16a34a" />
                  <Text style={styles.permissaoText}>Consultar termos de custódia e histórico</Text>
                </View>

                <View style={styles.permissaoItem}>
                  <Feather 
                    name={perfil === 'ADMIN' ? 'check-circle' : 'x-circle'} 
                    size={15} 
                    color={perfil === 'ADMIN' ? '#16a34a' : '#dc2626'} 
                  />
                  <Text style={[styles.permissaoText, perfil !== 'ADMIN' && styles.permissaoDesativada]}>
                    Cadastrar e tombar novos patrimônios
                  </Text>
                </View>

                <View style={styles.permissaoItem}>
                  <Feather 
                    name={perfil === 'ADMIN' ? 'check-circle' : 'x-circle'} 
                    size={15} 
                    color={perfil === 'ADMIN' ? '#16a34a' : '#dc2626'} 
                  />
                  <Text style={[styles.permissaoText, perfil !== 'ADMIN' && styles.permissaoDesativada]}>
                    Aprovar transferências de custódia
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.btnAlternarPerfil, { backgroundColor: perfil === 'ADMIN' ? '#f59e0b' : '#22c55e' }]}
                onPress={togglePerfil}
              >
                <Feather name="refresh-cw" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.btnAlternarPerfilText}>
                  {perfil === 'ADMIN' ? 'Mudar para Modo Consulta' : 'Mudar para Modo Administrador'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.btnModalSair}
                onPress={() => {
                  setModalPerfilVisivel(false);
                  handleLogout();
                }}
              >
                <AntDesign name="logout" size={16} color="#dc2626" style={{ marginRight: 8 }} />
                <Text style={styles.btnModalSairText}>Sair da conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    backgroundColor: '#1e3a8a', 
    paddingTop: 50, 
    paddingBottom: 16, 
    paddingHorizontal: 20, 
    elevation: 4,
  },
  userBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  userEmail: {
    color: '#93c5fd',
    fontSize: 11,
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
  titleSection: {
    marginTop: 4,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: '#93c5fd', fontSize: 13, fontWeight: '600', marginTop: 2 },
  headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 20,
  },
  logoutText: { color: '#fff', fontSize: 14, fontWeight: '700', marginRight: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalBody: {
    alignItems: 'center',
    paddingTop: 16,
  },
  modalAvatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#3b82f6',
    marginBottom: 10,
  },
  modalAvatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalAvatarInitial: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  modalUserName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  modalUserEmail: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalPerfilTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 16,
  },
  modalPerfilTagText: {
    fontSize: 13,
    fontWeight: '700',
  },
  permissoesContainer: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  permissoesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  permissaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  permissaoText: {
    fontSize: 13,
    color: '#475569',
  },
  permissaoDesativada: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  btnAlternarPerfil: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnAlternarPerfilText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  btnModalSair: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fee2e2',
    backgroundColor: '#fef2f2',
  },
  btnModalSairText: {
    color: '#dc2626',
    fontSize: 14,
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