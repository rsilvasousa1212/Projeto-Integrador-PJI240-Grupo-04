import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

const CATEGORIAS = ['Equipamento Médico', 'Mobiliário', 'Informática'];
const SETORES = ['UTI Adulto', 'Pronto Socorro', 'Enfermaria Pediátrica', 'Ambulatório', 'Almoxarifado Central'];
const RESPONSAVEIS = [
  'Não atribuído',
  'Dr. Renato Silva',
  'Enf. Carlos Almeida',
  'Dra. Mariana Costa',
  'João Silva (Almoxarifado)',
];

export default function NovoPatrimonioScreen() {
  const router = useRouter();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [tombamento, setTombamento] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [setor, setSetor] = useState(SETORES[0]);
  const [responsavel, setResponsavel] = useState(RESPONSAVEIS[0]);
  const [valorAquisicao, setValorAquisicao] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleSalvar = () => {
    if (!nome.trim() || !tombamento.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha pelo menos o Nome e o Número de Tombamento.');
      return;
    }

    // TODO: Quando o endpoint POST /api/patrimonios estiver pronto no Java,
    // enviaremos os dados para a API aqui.
    Alert.alert(
      'Sucesso!',
      `Patrimônio "${nome}" (Tombamento: ${tombamento}) cadastrado com sucesso e vinculado a ${responsavel}!`,
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
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Patrimônio</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SEÇÃO 1: DADOS DO BEM */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>
            <Feather name="box" size={16} color="#1e3a8a" /> Identificação do Equipamento
          </Text>

          <Text style={styles.label}>Nome / Descrição *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Eletrocardiógrafo 12 Canais"
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
                placeholder="Ex: Philips"
                placeholderTextColor="#94a3b8"
                value={marca}
                onChangeText={setMarca}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Modelo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: PageWriter TC30"
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

        {/* SEÇÃO 2: LOCALIZAÇÃO E RESPONSABILIDADE */}
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

          <Text style={[styles.label, { marginTop: 15 }]}>Responsável pelo Bem</Text>
          <View style={styles.chipWrap}>
            {RESPONSAVEIS.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.chipResponsavel, responsavel === r && styles.chipResponsavelActive]}
                onPress={() => setResponsavel(r)}
              >
                <Feather
                  name="user"
                  size={14}
                  color={responsavel === r ? '#fff' : '#64748b'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.chipText, responsavel === r && styles.chipTextActive]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SEÇÃO 3: VALOR E OBSERVAÇÕES */}
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

        {/* BOTÃO SALVAR */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar} activeOpacity={0.8}>
          <AntDesign name="check" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Cadastrar Patrimônio</Text>
        </TouchableOpacity>
      </ScrollView>
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
  chipResponsavel: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipResponsavelActive: { backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' },
  chipText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  chipTextActive: { color: '#ffffff' },

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
