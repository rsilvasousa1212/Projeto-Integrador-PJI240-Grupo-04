import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { ModalEditarPatrimonio } from '../../components/ModalEditarPatrimonio';
import { SeletorResponsavelModal } from '../../components/SeletorResponsavelModal';
import { getUser } from '../../services/authStorage';
import {
  atribuirResponsavel,
  atualizarPatrimonio,
  BemPatrimonial,
  excluirPatrimonio,
  obterPatrimonioPorId
} from '../../services/patrimonioService';
import { ServidorPublico } from '../../services/servidoresService';

export default function DetalhesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const usuario = getUser();
  const isAdmin = usuario.role === 'ADMIN';

  const [item, setItem] = useState<BemPatrimonial>(() => {
    return (
      obterPatrimonioPorId(id as string) || {
        id: String(id),
        nome: 'Material Permanente',
        tombamento: `20230${id}`,
        numeroSerie: 'N/A',
        marca: 'N/A',
        modelo: 'N/A',
        categoria: 'Geral',
        status: 'Ativo',
        unidade: 'Secretaria Municipal da Saúde de Diadema',
        setor: 'Não definido',
        sala: 'Não definida',
        responsavel: 'Não atribuído',
        responsavelDetalhes: null,
        dataAquisicao: 'N/A',
        valorAquisicao: 'R$ 0,00',
        observacao: 'Sem observações adicionais.',
      }
    );
  });

  const [modalAtribuicaoVisivel, setModalAtribuicaoVisivel] = useState(false);
  const [modalEdicaoVisivel, setModalEdicaoVisivel] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return { bg: '#dcfce7', text: '#166534' };
      case 'Em Manutenção':
        return { bg: '#fef08a', text: '#854d0e' };
      case 'Baixado':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#e2e8f0', text: '#475569' };
    }
  };

  const getIconeCategoria = (categoria: string) => {
    if (categoria === 'Informática') return 'computer';
    if (categoria === 'Equipamentos de Saúde') return 'medical-services';
    if (categoria === 'Mobiliário') return 'meeting-room';
    if (categoria === 'Climatização e Apoio') return 'ac-unit';
    return 'inventory';
  };

  const handleSelecionarResponsavel = (servidor: ServidorPublico | null) => {
    const atualizado = atribuirResponsavel(item.id, servidor, {
      nome: usuario.name,
      email: usuario.email,
    });
    if (atualizado) {
      setItem(atualizado);
      if (servidor) {
        Alert.alert(
          'Custódia Atualizada',
          `O bem patrimonial foi atribuído para ${servidor.nome} (${servidor.cargo}).`
        );
      } else {
        Alert.alert('Atribuição Removida', 'O bem agora consta como Não Atribuído.');
      }
    }
  };

  const handleSalvarEdicao = (dadosAtualizados: Partial<BemPatrimonial>) => {
    const atualizado = atualizarPatrimonio(item.id, dadosAtualizados, {
      nome: usuario.name,
      email: usuario.email,
    });
    if (atualizado) {
      setItem(atualizado);
      Alert.alert('Sucesso', 'Informações patrimoniais atualizadas com sucesso.');
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      'Excluir Bem Patrimonial',
      `Tem certeza de que deseja excluir permanentemente o bem "${item.nome}" (Tombamento: ${item.tombamento})? Esta ação é irreversível e ficará registrada no relatório de auditoria.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, Excluir',
          style: 'destructive',
          onPress: () => {
            const sucesso = excluirPatrimonio(item.id, {
              nome: usuario.name,
              email: usuario.email,
            });
            if (sucesso) {
              Alert.alert('Patrimônio Excluído', 'O material foi removido do inventário.');
              router.replace('/materiais');
            }
          },
        },
      ]
    );
  };

  const statusStyle = getStatusColor(item.status);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ficha do Patrimônio</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          <Text style={styles.tombamento}>
            Nº de Tombamento: <Text style={{ color: '#0f172a' }}>{item.tombamento}</Text>
          </Text>

          {isAdmin ? (
            <View style={styles.adminActionsBar}>
              <TouchableOpacity
                style={styles.btnEditarPatrimonio}
                onPress={() => setModalEdicaoVisivel(true)}
                activeOpacity={0.7}
              >
                <Feather name="edit-3" size={15} color="#1e3a8a" style={{ marginRight: 6 }} />
                <Text style={styles.btnEditarPatrimonioText}>Editar Dados</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnExcluirPatrimonio}
                onPress={handleExcluir}
                activeOpacity={0.7}
              >
                <Feather name="trash-2" size={15} color="#dc2626" style={{ marginRight: 6 }} />
                <Text style={styles.btnExcluirPatrimonioText}>Excluir Bem</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.consultaBar}>
              <Feather name="eye" size={14} color="#854d0e" style={{ marginRight: 6 }} />
              <Text style={styles.consultaBarText}>Modo Consulta • Somente administradores podem editar ou excluir</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Responsabilidade e Custódia</Text>
            {isAdmin && (
              <TouchableOpacity
                style={styles.btnEditarAtribuicao}
                onPress={() => setModalAtribuicaoVisivel(true)}
                activeOpacity={0.7}
              >
                <Feather name="user-check" size={14} color="#1e3a8a" style={{ marginRight: 6 }} />
                <Text style={styles.btnEditarAtribuicaoText}>
                  {item.responsavel === 'Não atribuído' ? 'Atribuir Responsável' : 'Alterar'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.responsavelCard}>
            <View style={styles.responsavelCardHeader}>
              <View
                style={[
                  styles.avatarCircleSmall,
                  item.responsavel === 'Não atribuído' && { backgroundColor: '#fee2e2' },
                ]}
              >
                <Feather
                  name={item.responsavel === 'Não atribuído' ? 'user-x' : 'user'}
                  size={18}
                  color={item.responsavel === 'Não atribuído' ? '#dc2626' : '#ffffff'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.responsavelNomeText}>{item.responsavel}</Text>
                {item.responsavelDetalhes ? (
                  <>
                    <Text style={styles.responsavelSubText}>
                      {item.responsavelDetalhes.cargo} • {item.responsavelDetalhes.setor}
                    </Text>
                    <Text style={styles.responsavelMetaText}>
                      Matrícula: {item.responsavelDetalhes.matricula} • {item.responsavelDetalhes.email}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.responsavelAlertaText}>
                    {item.responsavel === 'Não atribuído'
                      ? 'Nenhum servidor vinculado a este material permanente.'
                      : 'Servidor público registrado como detentor da custódia deste bem.'}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização Física</Text>
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={20} color="#64748b" style={styles.infoIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Unidade e Setor</Text>
              <Text style={styles.infoValue}>{item.unidade}</Text>
              <Text style={styles.infoSubValue}>
                {item.setor} • {item.sala}
              </Text>
            </View>
          </View>
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <Text style={styles.observacaoText}>{item.observacao}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.transferButton}
            onPress={() => router.push('/movimentacoes')}
          >
            <Feather name="repeat" size={18} color="#fff" />
            <Text style={styles.transferButtonText}>Solicitar Transferência</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SeletorResponsavelModal
        visible={modalAtribuicaoVisivel}
        onClose={() => setModalAtribuicaoVisivel(false)}
        responsavelAtualNome={item.responsavel}
        onSelect={handleSelecionarResponsavel}
      />

      <ModalEditarPatrimonio
        visible={modalEdicaoVisivel}
        item={item}
        onClose={() => setModalEdicaoVisivel(false)}
        onSalvar={handleSalvarEdicao}
      />
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
    width: 60,
    height: 60,
    backgroundColor: '#eff6ff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  statusText: { fontSize: 13, fontWeight: '700' },

  itemName: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  tombamento: { fontSize: 15, color: '#64748b', fontWeight: '600' },

  adminActionsBar: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  btnEditarPatrimonio: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnEditarPatrimonioText: {
    color: '#1e3a8a',
    fontSize: 14,
    fontWeight: '700',
  },
  btnExcluirPatrimonio: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnExcluirPatrimonioText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },

  consultaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fefce8',
    borderWidth: 1,
    borderColor: '#fef08a',
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
  },
  consultaBarText: {
    color: '#854d0e',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },

  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },
  btnEditarAtribuicao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnEditarAtribuicaoText: {
    color: '#1e3a8a',
    fontSize: 13,
    fontWeight: '700',
  },

  responsavelCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  responsavelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircleSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  responsavelNomeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  responsavelSubText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  responsavelMetaText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  responsavelAlertaText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 2,
    lineHeight: 16,
  },

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
  transferButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
