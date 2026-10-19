import { AntDesign, Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { BemPatrimonial } from '../services/patrimonioService';

interface Props {
  visible: boolean;
  item: BemPatrimonial;
  onClose: () => void;
  onSalvar: (dadosAtualizados: Partial<BemPatrimonial>) => void;
}

const CATEGORIAS = ['Informática', 'Equipamentos de Saúde', 'Mobiliário', 'Climatização e Apoio'];
const STATUS_OPCOES: ('Ativo' | 'Em Manutenção' | 'Baixado')[] = ['Ativo', 'Em Manutenção', 'Baixado'];
const SETORES = [
  'Almoxarifado Central - Sede SMS',
  'Departamento de TI - Sede SMS',
  'Central de Regulação e Vagas',
  'Vigilância Sanitária e Epidemiológica',
  'Farmácia Central Municipal',
  'UBS Eldorado - Sala de Vacinas',
  'UBS Centro - Recepção e Prontuários',
  'UBS Piraporinha - Central de Esterilização',
  'UBS Serraria - Triagem',
];

export function ModalEditarPatrimonio({ visible, item, onClose, onSalvar }: Props) {
  const [nome, setNome] = useState(item.nome);
  const [tombamento, setTombamento] = useState(item.tombamento);
  const [categoria, setCategoria] = useState(item.categoria);
  const [status, setStatus] = useState<'Ativo' | 'Em Manutenção' | 'Baixado'>(item.status);
  const [marca, setMarca] = useState(item.marca);
  const [modelo, setModelo] = useState(item.modelo);
  const [numeroSerie, setNumeroSerie] = useState(item.numeroSerie);
  const [setor, setSetor] = useState(item.setor);
  const [sala, setSala] = useState(item.sala);
  const [valorAquisicao, setValorAquisicao] = useState(item.valorAquisicao);
  const [observacao, setObservacao] = useState(item.observacao);

  const handleConfirmar = () => {
    onSalvar({
      nome: nome.trim(),
      tombamento: tombamento.trim(),
      categoria,
      status,
      marca: marca.trim(),
      modelo: modelo.trim(),
      numeroSerie: numeroSerie.trim(),
      setor,
      sala: sala.trim(),
      valorAquisicao: valorAquisicao.trim(),
      observacao: observacao.trim(),
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Editar Bem Patrimonial</Text>
              <Text style={styles.subtitle}>Tombamento: {item.tombamento}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <AntDesign name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Nome / Descrição do Bem</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Descrição do material permanente"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>Nº de Tombamento</Text>
            <TextInput
              style={styles.input}
              value={tombamento}
              onChangeText={setTombamento}
              placeholder="Número de tombo patrimonial"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>Situação / Status</Text>
            <View style={styles.chipRow}>
              {STATUS_OPCOES.map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[styles.chip, status === st && styles.chipActive]}
                  onPress={() => setStatus(st)}
                >
                  <Text style={[styles.chipText, status === st && styles.chipTextActive]}>
                    {st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.chipRow}>
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, categoria === cat && styles.chipActive]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text style={[styles.chipText, categoria === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Marca</Text>
                <TextInput
                  style={styles.input}
                  value={marca}
                  onChangeText={setMarca}
                  placeholder="Marca"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Modelo</Text>
                <TextInput
                  style={styles.input}
                  value={modelo}
                  onChangeText={setModelo}
                  placeholder="Modelo"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Nº de Série</Text>
                <TextInput
                  style={styles.input}
                  value={numeroSerie}
                  onChangeText={setNumeroSerie}
                  placeholder="Nº de Série"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Sala / Ambiente</Text>
                <TextInput
                  style={styles.input}
                  value={sala}
                  onChangeText={setSala}
                  placeholder="Ex: Sala 02"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <Text style={styles.label}>Setor de Lotação</Text>
            <View style={styles.chipRow}>
              {SETORES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, setor === s && styles.chipActive]}
                  onPress={() => setSetor(s)}
                >
                  <Text style={[styles.chipText, setor === s && styles.chipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Valor de Aquisição (R$)</Text>
            <TextInput
              style={styles.input}
              value={valorAquisicao}
              onChangeText={setValorAquisicao}
              placeholder="Ex: R$ 5.400,00"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>Observações Técnicas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={observacao}
              onChangeText={setObservacao}
              placeholder="Observações sobre o bem..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnCancelar} onPress={onClose}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSalvar} onPress={handleConfirmar}>
              <Feather name="check" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.btnSalvarText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxWidth: 560,
    maxHeight: '90%',
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  closeBtn: { padding: 4 },
  formScroll: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
  },
  textArea: { height: 70, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  chip: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipActive: { backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' },
  chipText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  chipTextActive: { color: '#ffffff' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  btnCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  btnCancelarText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  btnSalvar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  btnSalvarText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});
