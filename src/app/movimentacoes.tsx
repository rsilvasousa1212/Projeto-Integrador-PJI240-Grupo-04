import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const DADOS_MOVIMENTACOES = [
  { 
    id: '1', 
    numero: '2026/14788', 
    material: 'Monitor de Sinais Vitais Philips', 
    origem: 'Almoxarifado Central', 
    responsavelOrigem: 'Não atribuído',
    destino: 'UTI Adulto', 
    responsavelDestino: 'Não atribuído',
    dataEnvio: '29/09/2026', 
    status: 'Aguardando Aprovação' 
  },
  { 
    id: '2', 
    numero: '2026/14789', 
    material: 'Cadeira de Rodas Dobrável', 
    origem: 'Pronto Socorro', 
    responsavelOrigem: 'Não atribuído',
    destino: 'Enfermaria Pediátrica', 
    responsavelDestino: 'Não atribuído',
    dataEnvio: '01/10/2026', 
    status: 'Aprovado' 
  },
  { 
    id: '3', 
    numero: '2026/14790', 
    material: 'Desfibrilador Externo Automático', 
    origem: 'Ambulatório', 
    responsavelOrigem: 'Não atribuído',
    destino: 'Almoxarifado Central', 
    responsavelDestino: 'Não atribuído',
    dataEnvio: '02/10/2026', 
    status: 'Recusado' 
  },
];

const ABAS = ['Todas', 'Aguardando', 'Concluídas'];

export default function MovimentacoesScreen() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState('Todas');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Aprovado': return { bg: '#dcfce7', text: '#166534', icon: 'checkcircle' };
      case 'Aguardando Aprovação': return { bg: '#fef08a', text: '#854d0e', icon: 'clockcircle' };
      case 'Recusado': return { bg: '#fee2e2', text: '#991b1b', icon: 'closecircle' };
      default: return { bg: '#e2e8f0', text: '#475569', icon: 'infocirlce' };
    }
  };

  const movimentacoesFiltradas = DADOS_MOVIMENTACOES.filter(mov => {
    if (abaAtiva === 'Aguardando') return mov.status === 'Aguardando Aprovação';
    if (abaAtiva === 'Concluídas') return mov.status === 'Aprovado' || mov.status === 'Recusado';
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movimentações</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabsContainer}>
        {ABAS.map(aba => (
          <TouchableOpacity 
            key={aba} 
            style={[styles.tab, abaAtiva === aba && styles.tabActive]}
            onPress={() => setAbaAtiva(aba)}
          >
            <Text style={[styles.tabText, abaAtiva === aba && styles.tabTextActive]}>{aba}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={movimentacoesFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const statusStyle = getStatusStyle(item.status);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.numeroText}>Nº {item.numero}</Text>
                <Text style={styles.dataText}>{item.dataEnvio}</Text>
              </View>
              
              <Text style={styles.materialText}>{item.material}</Text>

              <View style={styles.flowContainer}>
                <View style={styles.flowPoint}>
                  <MaterialIcons name="upload" size={18} color="#64748b" />
                  <View style={styles.flowTextContainer}>
                    <Text style={styles.flowText}>De: {item.origem}</Text>
                    <Text style={styles.responsavelText}>👤 {item.responsavelOrigem}</Text>
                  </View>
                </View>
                
                <View style={styles.flowLine} />
                
                <View style={styles.flowPoint}>
                  <MaterialIcons name="download" size={18} color="#3b82f6" />
                  <View style={styles.flowTextContainer}>
                    <Text style={styles.flowTextDestino}>Para: {item.destino}</Text>
                    <Text style={styles.responsavelText}>👤 {item.responsavelDestino}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <AntDesign name={statusStyle.icon as any} size={12} color={statusStyle.text} />
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                </View>

                {item.status === 'Aguardando Aprovação' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.btnApprove}>
                      <AntDesign name="check" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnReject}>
                      <AntDesign name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>Nenhuma movimentação encontrada.</Text>
          </View>
        }
      />
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabActive: { backgroundColor: '#eff6ff' },
  tabText: { color: '#64748b', fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: '#1e3a8a', fontWeight: '700' },

  listContainer: { padding: 20, paddingBottom: 100 },
  
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 5 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  numeroText: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  dataText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  
  materialText: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 16 },

  flowContainer: { 
    backgroundColor: '#f8fafc', 
    padding: 12, 
    borderRadius: 8,
    marginBottom: 16
  },
  flowPoint: { flexDirection: 'row', alignItems: 'flex-start' },
  flowTextContainer: { marginLeft: 8, flex: 1 },
  flowText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  flowTextDestino: { color: '#3b82f6', fontSize: 13, fontWeight: '700' },
  responsavelText: { color: '#94a3b8', fontSize: 12, fontWeight: '500', marginTop: 2 },
  flowLine: {
    width: 2,
    height: 18,
    backgroundColor: '#e2e8f0',
    marginLeft: 8,
    marginVertical: 4
  },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, gap: 6 },
  statusText: { fontSize: 12, fontWeight: '700' },

  actionButtons: { flexDirection: 'row', gap: 8 },
  btnApprove: { backgroundColor: '#22c55e', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  btnReject: { backgroundColor: '#ef4444', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 16, fontSize: 16, fontWeight: '600' },
});
