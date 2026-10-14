import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock de detalhes ricos que simularemos da API futuramente
const DETALHES_MOCKADOS: Record<string, any> = {
  '1': {
    id: '1',
    nome: 'Monitor de Sinais Vitais Philips',
    tombamento: '2023001',
    numeroSerie: 'PH-998273-X',
    marca: 'Philips',
    modelo: 'IntelliVue MX400',
    categoria: 'Equipamento Médico',
    status: 'Ativo',
    unidade: 'Hospital Central',
    setor: 'UTI Adulto',
    sala: 'Leito 04',
    responsavel: 'Não atribuído',
    dataAquisicao: '15/03/2023',
    valorAquisicao: 'R$ 14.500,00',
    observacao: 'Equipamento calibrado anualmente. Próxima calibração em Mar/2027.',
  },
  '2': {
    id: '2',
    nome: 'Cadeira de Rodas Dobrável',
    tombamento: '2023002',
    numeroSerie: 'CR-00293',
    marca: 'Ortobras',
    modelo: 'Standard',
    categoria: 'Mobiliário',
    status: 'Em Manutenção',
    unidade: 'Hospital Central',
    setor: 'Pronto Socorro',
    sala: 'Corredor Térreo',
    responsavel: 'Não atribuído',
    dataAquisicao: '10/01/2022',
    valorAquisicao: 'R$ 850,00',
    observacao: 'Enviada para reparo da roda esquerda.',
  }
};

export default function DetalhesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Se não encontrar no Mock (para os itens 3 e 4), usa um genérico
  const item = DETALHES_MOCKADOS[id as string] || {
    id,
    nome: 'Patrimônio não detalhado no Mock',
    tombamento: `202300${id}`,
    numeroSerie: 'N/A',
    marca: 'N/A',
    modelo: 'N/A',
    categoria: 'Geral',
    status: 'Ativo',
    unidade: 'Hospital Central',
    setor: 'Não definido',
    sala: 'Não definida',
    responsavel: 'Não atribuído',
    dataAquisicao: 'N/A',
    valorAquisicao: 'R$ 0,00',
    observacao: 'Sem observações.',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return { bg: '#dcfce7', text: '#166534' };
      case 'Em Manutenção': return { bg: '#fef08a', text: '#854d0e' };
      case 'Baixado': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#e2e8f0', text: '#475569' };
    }
  };

  const getIconeCategoria = (categoria: string) => {
    if (categoria === 'Equipamento Médico') return 'monitor-heart';
    if (categoria === 'Mobiliário') return 'wheelchair-pickup';
    if (categoria === 'Informática') return 'laptop';
    return 'inventory';
  };

  const statusStyle = getStatusColor(item.status);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ficha do Patrimônio</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* CABEÇALHO DO ITEM */}
        <View style={styles.topCard}>
          <View style={styles.topCardHeader}>
            <View style={styles.iconWrapper}>
              <MaterialIcons name={getIconeCategoria(item.categoria) as any} size={32} color="#1e3a8a" />
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
            </View>
          </View>
          
          <Text style={styles.itemName}>{item.nome}</Text>
          <Text style={styles.tombamento}>Nº de Tombamento: <Text style={{ color: '#0f172a' }}>{item.tombamento}</Text></Text>
        </View>

        {/* BLOCO: RESPONSÁVEL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsabilidade</Text>
          <View style={styles.infoRow}>
            <Feather name="user" size={20} color="#64748b" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Responsável Atual</Text>
              <Text style={styles.infoValue}>{item.responsavel}</Text>
            </View>
          </View>
        </View>

        {/* BLOCO: LOCALIZAÇÃO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização Física</Text>
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={20} color="#64748b" style={styles.infoIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Unidade e Setor</Text>
              <Text style={styles.infoValue}>{item.unidade}</Text>
              <Text style={styles.infoSubValue}>{item.setor} • {item.sala}</Text>
            </View>
          </View>
        </View>

        {/* BLOCO: IDENTIFICAÇÃO E AQUISIÇÃO */}
        <View style={styles.gridSection}>
          <View style={styles.gridBox}>
            <Text style={styles.infoLabel}>Marca</Text>
            <Text style={styles.infoValue}>{item.marca}</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.infoLabel}>Modelo</Text>
            <Text style={styles.infoValue}>{item.modelo}</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.infoLabel}>Nº de Série</Text>
            <Text style={styles.infoValue}>{item.numeroSerie}</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.infoLabel}>Categoria</Text>
            <Text style={styles.infoValue}>{item.categoria}</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.infoLabel}>Data Aquisição</Text>
            <Text style={styles.infoValue}>{item.dataAquisicao}</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.infoLabel}>Valor (R$)</Text>
            <Text style={styles.infoValue}>{item.valorAquisicao}</Text>
          </View>
        </View>

        {/* BLOCO: OBSERVAÇÕES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <Text style={styles.observacaoText}>{item.observacao}</Text>
        </View>

        {/* BOTÕES DE AÇÃO */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.transferButton}>
            <Feather name="repeat" size={18} color="#fff" />
            <Text style={styles.transferButtonText}>Solicitar Transferência</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { 
    backgroundColor: '#1e3a8a', 
    paddingTop: 60, 
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  
  scrollContent: { padding: 20, paddingBottom: 60 },
  
  topCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  topCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  iconWrapper: {
    width: 60, height: 60, backgroundColor: '#eff6ff', borderRadius: 30, justifyContent: 'center', alignItems: 'center'
  },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  statusText: { fontSize: 13, fontWeight: '700' },
  
  itemName: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  tombamento: { fontSize: 15, color: '#64748b', fontWeight: '600' },

  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#334155', marginBottom: 15 },
  
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoIcon: { marginRight: 15, backgroundColor: '#f8fafc', padding: 10, borderRadius: 10, overflow: 'hidden' },
  infoLabel: { fontSize: 13, color: '#94a3b8', fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 16, color: '#0f172a', fontWeight: '600' },
  infoSubValue: { fontSize: 14, color: '#64748b', marginTop: 2 },

  gridSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  gridBox: {
    width: '50%',
    marginBottom: 20,
  },
  
  observacaoText: { fontSize: 15, color: '#475569', lineHeight: 22 },

  actionContainer: { marginTop: 10 },
  transferButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    elevation: 3,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  transferButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' }
});
