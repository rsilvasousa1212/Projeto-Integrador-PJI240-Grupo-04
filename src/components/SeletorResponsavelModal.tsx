import { AntDesign, Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { buscarServidores, ServidorPublico } from '../services/servidoresService';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (servidor: ServidorPublico | null) => void;
  responsavelAtualNome?: string;
}

export function SeletorResponsavelModal({
  visible,
  onClose,
  onSelect,
  responsavelAtualNome,
}: Props) {
  const [busca, setBusca] = useState('');

  const listaFiltrada = buscarServidores(busca);

  const handleSelect = (servidor: ServidorPublico | null) => {
    onSelect(servidor);
    setBusca('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Atribuir Responsável</Text>
              <Text style={styles.subtitle}>Selecione o servidor público detentor da carga</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <AntDesign name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nome, e-mail, matrícula ou cargo..."
              placeholderTextColor="#94a3b8"
              value={busca}
              onChangeText={setBusca}
              autoFocus
            />
            {busca.length > 0 && (
              <TouchableOpacity onPress={() => setBusca('')}>
                <AntDesign name="close-circle" size={16} color="#cbd5e1" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={listaFiltrada}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <TouchableOpacity
                style={[
                  styles.itemCard,
                  styles.unassignedCard,
                  responsavelAtualNome === 'Não atribuído' && styles.itemCardSelected,
                ]}
                onPress={() => handleSelect(null)}
              >
                <View style={[styles.avatarCircle, { backgroundColor: '#fee2e2' }]}>
                  <Feather name="user-x" size={18} color="#dc2626" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemNome, { color: '#dc2626' }]}>Não atribuído</Text>
                  <Text style={styles.itemDetalhe}>Deixar sem responsável definido provisoriamente</Text>
                </View>
              </TouchableOpacity>
            }
            renderItem={({ item }) => {
              const selecionado = responsavelAtualNome === item.nome;
              return (
                <TouchableOpacity
                  style={[styles.itemCard, selecionado && styles.itemCardSelected]}
                  onPress={() => handleSelect(item)}
                >
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>{item.nome.charAt(0)}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.rowTitle}>
                      <Text style={styles.itemNome}>{item.nome}</Text>
                      {selecionado && (
                        <View style={styles.badgeAtual}>
                          <Text style={styles.badgeAtualText}>Atual</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.itemCargo}>{item.cargo}</Text>
                    <Text style={styles.itemSetor}>{item.setor}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.itemMeta}>Matrícula: {item.matricula}</Text>
                      <Text style={styles.itemMeta}>•</Text>
                      <Text style={styles.itemMeta}>{item.email}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="user-x" size={32} color="#cbd5e1" />
                <Text style={styles.emptyText}>{`Nenhum servidor encontrado com "${busca}".`}</Text>
              </View>
            }
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingTop: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  closeBtn: { padding: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  unassignedCard: { backgroundColor: '#fef2f2', borderColor: '#fecaca', marginBottom: 6 },
  itemCardSelected: { borderColor: '#1e3a8a', backgroundColor: '#eff6ff' },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  rowTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemNome: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  badgeAtual: {
    backgroundColor: '#dcfce7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  badgeAtualText: { fontSize: 11, fontWeight: '700', color: '#166534' },
  itemCargo: { fontSize: 13, fontWeight: '600', color: '#334155', marginTop: 1 },
  itemSetor: { fontSize: 12, color: '#64748b', marginTop: 1 },
  itemDetalhe: { fontSize: 12, color: '#b91c1c', marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  itemMeta: { fontSize: 11, color: '#94a3b8' },
  emptyContainer: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { color: '#94a3b8', fontSize: 14, marginTop: 8 },
});
