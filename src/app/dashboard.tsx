import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppLayout } from '../components/AppLayout';
import { getUser, UserProfile } from '../services/authStorage';
import {
  AcaoAuditoria,
  BemPatrimonial,
  obterHistoricoAuditoria,
  obterMetricasPatrimonio,
  obterTodosPatrimonios,
  sincronizarAuditoriaComBanco,
  sincronizarPatrimoniosComBanco,
} from '../services/patrimonioService';

export default function DashboardScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UserProfile>(() => getUser());
  const [metricas, setMetricas] = useState(() => obterMetricasPatrimonio());
  const [todosBens, setTodosBens] = useState<BemPatrimonial[]>(() => obterTodosPatrimonios());
  const [atividadesRecentes, setAtividadesRecentes] = useState<AcaoAuditoria[]>(() =>
    obterHistoricoAuditoria().slice(0, 5)
  );

  useEffect(() => {
    const carregar = () => {
      setUsuario(getUser());
      setMetricas(obterMetricasPatrimonio());
      setTodosBens(obterTodosPatrimonios());
      setAtividadesRecentes(obterHistoricoAuditoria().slice(0, 5));
    };

    carregar();
    sincronizarPatrimoniosComBanco().then(() => carregar());
    sincronizarAuditoriaComBanco().then(() => carregar());

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const aoFocar = () => {
        carregar();
        sincronizarPatrimoniosComBanco().then(() => carregar());
        sincronizarAuditoriaComBanco().then(() => carregar());
      };
      window.addEventListener('focus', aoFocar);
      return () => window.removeEventListener('focus', aoFocar);
    }
  }, []);

  const categoriasContagem = useMemo(() => {
    const contagem: Record<string, number> = {
      Informática: 0,
      'Equipamentos de Saúde': 0,
      Mobiliário: 0,
      'Climatização e Apoio': 0,
    };

    todosBens.forEach((b) => {
      if (contagem[b.categoria] !== undefined) {
        contagem[b.categoria]++;
      } else {
        contagem[b.categoria] = 1;
      }
    });

    const total = todosBens.length || 1;

    return Object.entries(contagem).map(([nome, qtd]) => ({
      nome,
      qtd,
      porcentagem: Math.round((qtd / total) * 100),
    }));
  }, [todosBens]);

  const getIconeCategoria = (categoria: string) => {
    switch (categoria) {
      case 'Informática':
        return 'monitor';
      case 'Equipamentos de Saúde':
        return 'activity';
      case 'Mobiliário':
        return 'archive';
      case 'Climatização e Apoio':
        return 'wind';
      default:
        return 'box';
    }
  };

  const getCorBadgeAuditoria = (tipo: string) => {
    switch (tipo) {
      case 'CADASTRO':
        return { bg: '#dcfce7', text: '#166534', label: 'Cadastro' };
      case 'EDICAO':
        return { bg: '#fef08a', text: '#854d0e', label: 'Alteração' };
      case 'ATRIBUICAO':
        return { bg: '#e0f2fe', text: '#0369a1', label: 'Custódia' };
      case 'EXCLUSAO':
        return { bg: '#fee2e2', text: '#991b1b', label: 'Exclusão' };
      case 'TRANSFERENCIA':
        return { bg: '#f3e8ff', text: '#7e22ce', label: 'Transferência' };
      default:
        return { bg: '#f1f5f9', text: '#475569', label: 'Registro' };
    }
  };

  return (
    <AppLayout
      rotaAtiva="dashboard"
      titulo="Visão Geral do Patrimônio"
      subtitulo="Secretaria Municipal da Saúde • Prefeitura de Diadema"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextColumn}>
            <View style={styles.badgeSaudacao}>
              <Text style={styles.badgeSaudacaoText}>
                {usuario.role === 'ADMIN' ? '🛡️ Acesso Administrador' : '👁️ Acesso Consulta'}
              </Text>
            </View>
            <Text style={styles.welcomeTitle}>
              Olá, {usuario.name || 'Servidor(a)'}!
            </Text>
            <Text style={styles.welcomeDescription}>
              Bem-vindo ao painel central de controle patrimonial da Secretaria da Saúde de Diadema.
              Acompanhe o inventário, a localização de materiais e a rastreabilidade das movimentações.
            </Text>
          </View>
          <View style={styles.welcomeIconWrapper}>
            <MaterialIcons name="health-and-safety" size={54} color="#0284c7" />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Indicadores Principais</Text>
          <Text style={styles.sectionSub}>Dados consolidados em tempo real</Text>
        </View>

        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { borderLeftColor: '#0284c7' }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Total de Bens</Text>
              <View style={[styles.kpiIconBox, { backgroundColor: '#e0f2fe' }]}>
                <Feather name="box" size={20} color="#0284c7" />
              </View>
            </View>
            <Text style={styles.kpiValue}>{metricas.totalBens}</Text>
            <Text style={styles.kpiDetail}>
              {metricas.ativos} em uso • {metricas.manutencao} em manutenção
            </Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#10b981' }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Valor Patrimonial</Text>
              <View style={[styles.kpiIconBox, { backgroundColor: '#dcfce7' }]}>
                <Feather name="dollar-sign" size={20} color="#10b981" />
              </View>
            </View>
            <Text style={styles.kpiValue}>
              R$ {metricas.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.kpiDetail}>Ativos permanentes municipais</Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#8b5cf6' }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Remanejamentos</Text>
              <View style={[styles.kpiIconBox, { backgroundColor: '#ede9fe' }]}>
                <Feather name="repeat" size={20} color="#8b5cf6" />
              </View>
            </View>
            <Text style={styles.kpiValue}>4</Text>
            <Text style={styles.kpiDetail}>Movimentações entre UBSs</Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#f59e0b' }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Auditoria e Rastreio</Text>
              <View style={[styles.kpiIconBox, { backgroundColor: '#fef3c7' }]}>
                <Feather name="shield" size={20} color="#f59e0b" />
              </View>
            </View>
            <Text style={styles.kpiValue}>{metricas.totalAcoes}</Text>
            <Text style={styles.kpiDetail}>Ações auditadas no sistema</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <Text style={styles.sectionSub}>Acesse diretamente os módulos do sistema</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.7}
            onPress={() => router.push('/materiais')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Consulta de Materiais: Pesquise por tombamento, nome, setor ou responsável nominal"
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#e0f2fe' }]}>
              <Feather name="search" size={24} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Consulta de Materiais</Text>
              <Text style={styles.actionDescription}>
                Pesquise por tombamento, nome, setor ou responsável nominal.
              </Text>
            </View>
            <Feather name="arrow-right" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.7}
            onPress={() => router.push('/relatorios')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Relatórios e Auditoria: Consulte o histórico completo de ações e emita relatórios oficiais"
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#fef3c7' }]}>
              <Feather name="file-text" size={24} color="#d97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Relatórios & Auditoria</Text>
              <Text style={styles.actionDescription}>
                Consulte o histórico completo de ações e emita relatórios oficiais.
              </Text>
            </View>
            <Feather name="arrow-right" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.7}
            onPress={() => router.push('/movimentacoes')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Movimentações de Bens: Gerencie transferências e termos de responsabilidade entre unidades"
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#ede9fe' }]}>
              <Feather name="repeat" size={24} color="#7c3aed" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Movimentações de Bens</Text>
              <Text style={styles.actionDescription}>
                Gerencie transferências e termos de responsabilidade entre unidades.
              </Text>
            </View>
            <Feather name="arrow-right" size={20} color="#94a3b8" />
          </TouchableOpacity>

          {usuario.role === 'ADMIN' && (
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.7}
              onPress={() => router.push('/novo-patrimonio')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cadastrar Novo Bem: Registre tombamento, especificações técnicas e alocação física"
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#dcfce7' }]}>
                <Feather name="plus-circle" size={24} color="#16a34a" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>Cadastrar Novo Bem</Text>
                <Text style={styles.actionDescription}>
                  Registre tombamento, especificações técnicas e alocação física.
                </Text>
              </View>
              <Feather name="arrow-right" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Distribuição do Acervo por Categoria</Text>
          <Text style={styles.sectionSub}>Bens alocados na Secretaria e Unidades de Saúde</Text>
        </View>

        <View style={styles.categoryCard}>
          {categoriasContagem.map((cat, idx) => (
            <View key={cat.nome} style={styles.categoryItem}>
              <View style={styles.categoryHeaderRow}>
                <View style={styles.categoryLabelGroup}>
                  <View style={styles.categoryMiniIcon}>
                    <Feather name={getIconeCategoria(cat.nome)} size={16} color="#0284c7" />
                  </View>
                  <Text style={styles.categoryItemName}>{cat.nome}</Text>
                </View>
                <Text style={styles.categoryItemCount}>
                  {cat.qtd} {cat.qtd === 1 ? 'item' : 'itens'} ({cat.porcentagem}%)
                </Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${cat.porcentagem}%`,
                      backgroundColor:
                        idx === 0
                          ? '#0284c7'
                          : idx === 1
                          ? '#10b981'
                          : idx === 2
                          ? '#f59e0b'
                          : '#8b5cf6',
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderBetween}>
            <View>
              <Text style={styles.sectionTitle}>Últimas Atividades no Sistema</Text>
              <Text style={styles.sectionSub}>Rastreabilidade das operações mais recentes</Text>
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push('/relatorios')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Ver histórico completo de auditoria"
            >
              <Text style={styles.seeAllButtonText}>Ver auditoria completa</Text>
              <Feather name="chevron-right" size={14} color="#0284c7" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.auditListCard}>
          {atividadesRecentes.map((item, index) => {
            const badge = getCorBadgeAuditoria(item.tipo);
            return (
              <View
                key={item.id}
                style={[
                  styles.auditRow,
                  index === atividadesRecentes.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.auditBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.auditBadgeText, { color: badge.text }]}>
                    {badge.label}
                  </Text>
                </View>

                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text style={styles.auditTitle}>{item.titulo}</Text>
                  <Text style={styles.auditDesc} numberOfLines={1}>
                    {item.patrimonioNome} (Tombamento: {item.tombamento})
                  </Text>
                  <Text style={styles.auditAuthor}>
                    Por: {item.usuarioNome} • {item.dataHora}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Prefeitura Municipal de Diadema • Secretaria de Saúde • Sistema de Gestão Patrimonial v1.0.0
          </Text>
        </View>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  welcomeTextColumn: {
    flex: 1,
    paddingRight: 16,
  },
  badgeSaudacao: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeSaudacaoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369a1',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  welcomeDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  welcomeIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  sectionHeader: {
    marginBottom: 14,
    marginTop: 8,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284c7',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  kpiCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  kpiDetail: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 3,
  },
  actionDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
    paddingRight: 8,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryMiniIcon: {
    marginRight: 8,
  },
  categoryItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  categoryItemCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  auditListCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 24,
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  auditBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  auditBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  auditTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  auditDesc: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 2,
  },
  auditAuthor: {
    fontSize: 11,
    color: '#94a3b8',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
