import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { SeletorResponsavelModal } from '../components/SeletorResponsavelModal';
import { adicionarNovoPatrimonio } from '../services/patrimonioService';
import { ServidorPublico } from '../services/servidoresService';

const CATEGORIAS = ['Informática', 'Equipamentos de Saúde', 'Mobiliário', 'Climatização e Apoio'];
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

export default function NovoPatrimonioScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [tombamento, setTombamento] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [setor, setSetor] = useState(SETORES[0]);
  const [responsavel, setResponsavel] = useState('Não atribuído');
  const [responsavelDetalhes, setResponsavelDetalhes] = useState<ServidorPublico | null>(null);
  const [modalResponsavelVisivel, setModalResponsavelVisivel] = useState(false);
  const [valorAquisicao, setValorAquisicao] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleSalvar = () => {
    if (!nome.trim() || !tombamento.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha pelo menos o Nome e o Número de Tombamento.');
      return;
    }

    adicionarNovoPatrimonio({
      nome: nome.trim(),
      tombamento: tombamento.trim(),
      categoria,
      marca: marca.trim() || 'N/A',
      modelo: modelo.trim() || 'N/A',
      numeroSerie: numeroSerie.trim() || 'N/A',
      setor,
      responsavel,
      responsavelDetalhes,
      valorAquisicao: valorAquisicao.trim() || 'R$ 0,00',
      observacao: observacao.trim() || 'Cadastrado no sistema de gestão patrimonial.',
    });

    Alert.alert(
      'Sucesso',
      `Patrimônio "${nome}" cadastrado com sucesso!`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Patrimônio</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>
            <Feather name="box" size={16} color="#1e3a8a" /> Identificação do Equipamento
          </Text>

          <Text style={styles.label}>Nome / Descrição *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Câmara de Vacinas 280L ou Computador Desktop"
            placeholderTextColor="#94a3b8"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Nº de Tombamento (Patrimônio) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2024009"
            placeholderTextColor="#94a3b8"
            value={tombamento}
            onChangeText={setTombamento}
            keyboardType="numeric"
          />

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
                placeholder="Ex: Dell, Indrel"
                placeholderTextColor="#94a3b8"
                value={marca}
                onChangeText={setMarca}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Modelo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: OptiPlex 3000"
                placeholderTextColor="#94a3b8"
                value={modelo}
                onChangeText={setModelo}
              />
            </View>
          </View>

          <Text style={styles.label}>Nº de Série</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: SN-883719-B"
            placeholderTextColor="#94a3b8"
            value={numeroSerie}
            onChangeText={setNumeroSerie}
          />
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>
            <Feather name="map-pin" size={16} color="#1e3a8a" /> Localização & Responsável
          </Text>

          <Text style={styles.label}>Setor de Destino</Text>
          <View style={styles.chipWrap}>
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

          <Text style={[styles.label, { marginTop: 15 }]}>Responsável pelo Bem (Custódia)</Text>
          {responsavelDetalhes ? (
            <View style={styles.servidorSelecionadoCard}>
              <View style={styles.avatarMiniCircle}>
                <Text style={styles.avatarMiniInitial}>{responsavelDetalhes.nome.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.servidorSelecionadoNome}>{responsavelDetalhes.nome}</Text>
                <Text style={styles.servidorSelecionadoSub}>
                  {responsavelDetalhes.cargo} • {responsavelDetalhes.setor}
                </Text>
                <Text style={styles.servidorSelecionadoMeta}>
                  Matrícula: {responsavelDetalhes.matricula} • {responsavelDetalhes.email}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.btnTrocarServidor}
                onPress={() => setModalResponsavelVisivel(true)}
              >
                <Feather name="edit-2" size={15} color="#1e3a8a" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnRemoverServidor}
                onPress={() => {
                  setResponsavel('Não atribuído');
                  setResponsavelDetalhes(null);
                }}
              >
                <Feather name="x" size={16} color="#dc2626" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.btnBuscarServidor}
              onPress={() => setModalResponsavelVisivel(true)}
              activeOpacity={0.7}
            >
              <Feather name="search" size={16} color="#1e3a8a" style={{ marginRight: 8 }} />
              <Text style={styles.btnBuscarServidorText}>Pesquisar e Atribuir Servidor</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>
            <MaterialIcons name="attach-money" size={18} color="#1e3a8a" /> Informações Contábeis
          </Text>

          <Text style={styles.label}>Valor de Aquisição (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 8.500,00"
            placeholderTextColor="#94a3b8"
            value={valorAquisicao}
            onChangeText={setValorAquisicao}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Observações Técnicas / Calibração</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Informações adicionais, garantia ou data de calibração..."
            placeholderTextColor="#94a3b8"
            value={observacao}
            onChangeText={setObservacao}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar} activeOpacity={0.8}>
          <AntDesign name="check" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Cadastrar Patrimônio</Text>
        </TouchableOpacity>
      </ScrollView>
      <SeletorResponsavelModal
        visible={modalResponsavelVisivel}
        onClose={() => setModalResponsavelVisivel(false)}
        responsavelAtualNome={responsavel}
        onSelect={(servidor) => {
          if (servidor) {
            setResponsavel(servidor.nome);
            setResponsavelDetalhes(servidor);
          } else {
            setResponsavel('Não atribuído');
            setResponsavelDetalhes(null);
          }
        }}
      />
    </KeyboardAvoidingView>
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
    elevation: 4,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },

  scrollContent: { padding: 20, paddingBottom: 60 },

  cardSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: { flexDirection: 'row' },

  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  chipWrap: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 6 },
  chip: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipActive: { backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' },
  chipText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  chipTextActive: { color: '#ffffff' },

  btnBuscarServidor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93c5fd',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  btnBuscarServidorText: {
    color: '#1e3a8a',
    fontSize: 14,
    fontWeight: '700',
  },
  servidorSelecionadoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
  },
  avatarMiniCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarMiniInitial: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  servidorSelecionadoNome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  servidorSelecionadoSub: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  servidorSelecionadoMeta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  btnTrocarServidor: {
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    marginRight: 6,
  },
  btnRemoverServidor: {
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },

  saveButton: {
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginTop: 10,
  },
  saveButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
});
