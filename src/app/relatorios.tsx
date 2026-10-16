import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import {
  AcaoAuditoria,
  obterHistoricoAuditoria,
  obterMetricasPatrimonio,
  TipoAcaoAuditoria
} from '../services/patrimonioService';

const FILTROS_TIPO = [
  { label: 'Todos', valor: 'TODOS' },
  { label: 'Cadastros', valor: 'CADASTRO' },
  { label: 'Alterações', valor: 'EDICAO' },
  { label: 'Atribuições', valor: 'ATRIBUICAO' },
  { label: 'Exclusões', valor: 'EXCLUSAO' },
  { label: 'Transferências', valor: 'TRANSFERENCIA' },
];

export default function RelatoriosScreen() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');

  const metricas = useMemo(() => obterMetricasPatrimonio(), []);
  const historicoCompleto = useMemo(() => obterHistoricoAuditoria(), []);

  const historicoFiltrado = useMemo(() => {
    return historicoCompleto.filter((item) => {
      const bateTipo = tipoFiltro === 'TODOS' || item.tipo === tipoFiltro;
      if (!bateTipo) return false;

      if (!busca.trim()) return true;

      const termo = busca.toLowerCase().trim();
      return (
        item.titulo.toLowerCase().includes(termo) ||
        item.descricao.toLowerCase().includes(termo) ||
        item.patrimonioNome.toLowerCase().includes(termo) ||
        item.tombamento.toLowerCase().includes(termo) ||
        item.usuarioNome.toLowerCase().includes(termo)
      );
    });
  }, [historicoCompleto, tipoFiltro, busca]);

  const handleExportar = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.print();
    } else {
      Alert.alert(
        'Exportação de Relatório',
        `Relatório com ${historicoFiltrado.length} registros e patrimônio total avaliado em R$ ${metricas.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pronto para impressão.`
      );
    }
  };

  const getTipoEstilo = (tipo: TipoAcaoAuditoria) => {
    switch (tipo) {
      case 'CADASTRO':
        return { bg: '#dcfce7', text: '#166534', icon: 'plus-circle' as const, rotulo: 'Cadastro' };
      case 'EDICAO':
        return { bg: '#fef3c7', text: '#92400e', icon: 'edit-3' as const, rotulo: 'Alteração' };
      case 'EXCLUSAO':
        return { bg: '#fee2e2', text: '#991b1b', icon: 'trash-2' as const, rotulo: 'Exclusão' };
      case 'ATRIBUICAO':
        return { bg: '#eff6ff', text: '#1e40af', icon: 'user-check' as const, rotulo: 'Custódia' };
      case 'TRANSFERENCIA':
        return { bg: '#f3e8ff', text: '#6b21a8', icon: 'repeat' as const, rotulo: 'Transferência' };
      default:
        return { bg: '#f1f5f9', text: '#475569', icon: 'info' as const, rotulo: 'Ação' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.headerTitle}>Relatórios & Auditoria</Text>
            <Text style={styles.headerSubtitle}>Secretaria Municipal da Saúde de Diadema</Text>
          </View>
          <TouchableOpacity style={styles.btnPrint} onPress={handleExportar} activeOpacity={0.8}>
            <Feather name="printer" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.btnPrintText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={historicoFiltrado}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Cards de Indicadores / Métricas do Inventário */}
            <View style={styles.kpiContainer}>
              <View style={[styles.kpiCard, { borderLeftColor: '#1e3a8a' }]}>
                <View style={styles.kpiHeader}>
                  <Text style={styles.kpiLabel}>Total de Bens</Text>
                  <Feather name="package" size={18} color="#1e3a8a" />
                </View>
                <Text style={styles.kpiValue}>{metricas.totalBens}</Text>
                <Text style={styles.kpiSub}>Patrimônios inventariados</Text>
              </View>

              <View style={[styles.kpiCard, { borderLeftColor: '#16a34a' }]}>
                <View style={styles.kpiHeader}>
                  <Text style={styles.kpiLabel}>Valor Patrimonial</Text>
                  <MaterialIcons name="attach-money" size={20} color="#16a34a" />
                </View>
                <Text style={[styles.kpiValue, { fontSize: 18, color: '#166534' }]}>
                  R$ {metricas.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
                <Text style={styles.kpiSub}>Total em bens permanentes</Text>
              </View>

              <View style={[styles.kpiCard, { borderLeftColor: '#f59e0b' }]}>
                <View style={styles.kpiHeader}>
                  <Text style={styles.kpiLabel}>Em Manutenção / Baixa</Text>
                  <Feather name="alert-triangle" size={18} color="#f59e0b" />
                </View>
                <Text style={[styles.kpiValue, { color: '#b45309' }]}>
                  {metricas.manutencao + metricas.baixados}
                </Text>
                <Text style={styles.kpiSub}>
                  {metricas.manutencao} conserto • {metricas.baixados} baixados
                </Text>
              </View>

              <View style={[styles.kpiCard, { borderLeftColor: '#7c3aed' }]}>
                <View style={styles.kpiHeader}>
                  <Text style={styles.kpiLabel}>Ações no Sistema</Text>
                  <Feather name="activity" size={18} color="#7c3aed" />
                </View>
                <Text style={[styles.kpiValue, { color: '#6d28d9' }]}>{metricas.totalAcoes}</Text>
                <Text style={styles.kpiSub}>Eventos registrados no log</Text>
              </View>
            </View>

            {/* Barra de Pesquisa e Filtros de Auditoria */}
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Histórico de Ocorrências e Ações</Text>
              <Text style={styles.sectionBadge}>{historicoFiltrado.length} registros</Text>
            </View>

            <View style={styles.searchBox}>
              <Feather name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por bem, tombamento, responsável ou ação..."
                placeholderTextColor="#94a3b8"
                value={busca}
                onChangeText={setBusca}
              />
              {busca.length > 0 && (
                <TouchableOpacity onPress={() => setBusca('')}>
                  <AntDesign name="close-circle" size={16} color="#cbd5e1" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {FILTROS_TIPO.map((f) => (
                <TouchableOpacity
                  key={f.valor}
                  style={[styles.filterChip, tipoFiltro === f.valor && styles.filterChipActive]}
                  onPress={() => setTipoFiltro(f.valor)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      tipoFiltro === f.valor && styles.filterChipTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => {
          const estilo = getTipoEstilo(item.tipo);
          return (
            <View style={styles.timelineItem}>
              <View style={styles.timelineHeader}>
                <View style={[styles.typeBadge, { backgroundColor: estilo.bg }]}>
                  <Feather
                    name={estilo.icon}
                    size={13}
                    color={estilo.text}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[styles.typeBadgeText, { color: estilo.text }]}>
                    {estilo.rotulo}
                  </Text>
                </View>
                <Text style={styles.timelineDataHora}>{item.dataHora}</Text>
              </View>

              <Text style={styles.timelineTitulo}>{item.titulo}</Text>
              <Text style={styles.timelineDescricao}>{item.descricao}</Text>

              <View style={styles.timelineMetaBox}>
                <View style={styles.metaRow}>
                  <Feather name="box" size={13} color="#64748b" style={{ marginRight: 5 }} />
                  <Text style={styles.metaLabel}>Bem: </Text>
                  <Text style={styles.metaValue} numberOfLines={1}>
                    {item.patrimonioNome} (Tombo: {item.tombamento})
                  </Text>
                </View>

                <View style={styles.metaRow}>
                  <Feather name="user" size={13} color="#64748b" style={{ marginRight: 5 }} />
                  <Text style={styles.metaLabel}>Realizado por: </Text>
                  <Text style={styles.metaValue} numberOfLines={1}>
                    {item.usuarioNome}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={40} color="#cbd5e1" />
            <Text style={styles.emptyText}>Nenhuma ocorrência encontrada para o filtro selecionado.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    backgroundColor: '#1e3a8a',
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 20,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: '#93c5fd', fontSize: 12, fontWeight: '600', marginTop: 2 },
  btnPrint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnPrintText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },

  listContent: { padding: 16, paddingBottom: 60 },

  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  kpiLabel: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  kpiValue: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  kpiSub: { fontSize: 11, color: '#94a3b8', marginTop: 3 },

  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  sectionBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e3a8a',
    backgroundColor: '#eff6ff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },

  filterScroll: { gap: 8, paddingBottom: 14 },
  filterChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  filterChipActive: { backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filterChipTextActive: { color: '#ffffff' },

  timelineItem: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  timelineDataHora: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  timelineTitulo: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  timelineDescricao: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 10 },
  timelineMetaBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
    gap: 4,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaLabel: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  metaValue: { fontSize: 12, color: '#1e293b', flex: 1 },

  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#94a3b8', fontSize: 14, marginTop: 10, textAlign: 'center' },
});
