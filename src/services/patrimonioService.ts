import { Platform } from 'react-native';
import { ServidorPublico } from './servidoresService';

export interface BemPatrimonial {
  id: string;
  nome: string;
  tombamento: string;
  setor: string;
  status: 'Ativo' | 'Em Manutenção' | 'Baixado';
  categoria: string;
  responsavel: string;
  responsavelDetalhes?: ServidorPublico | null;
  numeroSerie: string;
  marca: string;
  modelo: string;
  unidade: string;
  sala: string;
  dataAquisicao: string;
  valorAquisicao: string;
  observacao: string;
}

const DADOS_INICIAIS: BemPatrimonial[] = [
  {
    id: '1',
    nome: 'Câmara de Conservação de Vacinas 280L',
    tombamento: '2023011',
    numeroSerie: 'CVAC-88912-SP',
    marca: 'Indrel',
    modelo: 'Ultra Freezer RV 280',
    categoria: 'Equipamentos de Saúde',
    status: 'Ativo',
    unidade: 'Rede Municipal de Diadema',
    setor: 'Sala de Vacinas - UBS Eldorado',
    sala: 'Sala 03 - Imunização',
    responsavel: 'Não atribuído',
    dataAquisicao: '14/03/2023',
    valorAquisicao: 'R$ 18.900,00',
    observacao: 'Equipamento com monitoramento térmico contínuo e bateria interna de segurança.',
  },
  {
    id: '2',
    nome: 'Computador Desktop Dell OptiPlex 3000',
    tombamento: '2023012',
    numeroSerie: 'BR-DELL-88391',
    marca: 'Dell',
    modelo: 'OptiPlex 3000 SFF',
    categoria: 'Informática',
    status: 'Ativo',
    unidade: 'Sede da Secretaria de Saúde',
    setor: 'Central de Regulação e Vagas',
    sala: 'Sala 102 - Regulação de Exames',
    responsavel: 'Não atribuído',
    dataAquisicao: '22/05/2023',
    valorAquisicao: 'R$ 4.250,00',
    observacao: 'Estação de trabalho conectada à rede corporativa para operação do sistema de vagas do SUS.',
  },
  {
    id: '3',
    nome: 'Armário de Aço para Prontuários (4 Portas)',
    tombamento: '2023013',
    numeroSerie: 'ARM-00441-D',
    marca: 'Pandin',
    modelo: 'Aço Premium 4P',
    categoria: 'Mobiliário',
    status: 'Ativo',
    unidade: 'Rede Municipal de Diadema',
    setor: 'Recepção - UBS Centro',
    sala: 'Arquivo de Prontuários',
    responsavel: 'Não atribuído',
    dataAquisicao: '10/02/2022',
    valorAquisicao: 'R$ 1.350,00',
    observacao: 'Fechadura cilíndrica com chave mestra para guarda segura de documentos físicos dos pacientes.',
  },
  {
    id: '4',
    nome: 'Autoclave Digital de Bancada 21L',
    tombamento: '2023014',
    numeroSerie: 'ATC-77120-B',
    marca: 'Cristófoli',
    modelo: 'Vitale Class CD',
    categoria: 'Equipamentos de Saúde',
    status: 'Em Manutenção',
    unidade: 'Rede Municipal de Diadema',
    setor: 'Central de Esterilização - UBS Piraporinha',
    sala: 'CME (Central de Material)',
    responsavel: 'Não atribuído',
    dataAquisicao: '18/08/2023',
    valorAquisicao: 'R$ 6.800,00',
    observacao: 'Aguardando substituição da válvula solenoide pelo serviço técnico autorizado.',
  },
  {
    id: '5',
    nome: 'Impressora Térmica de Etiquetas Zebra',
    tombamento: '2023015',
    numeroSerie: 'ZB-44819-T',
    marca: 'Zebra',
    modelo: 'ZD220',
    categoria: 'Informática',
    status: 'Ativo',
    unidade: 'Rede Municipal de Diadema',
    setor: 'Farmácia Central Municipal',
    sala: 'Dispensação de Medicamentos',
    responsavel: 'Não atribuído',
    dataAquisicao: '05/11/2023',
    valorAquisicao: 'R$ 1.890,00',
    observacao: 'Utilizada para impressão de etiquetas de identificação de medicamentos e posologias.',
  },
  {
    id: '6',
    nome: 'Balança Antropométrica Digital Adulto/Infantil',
    tombamento: '2023016',
    numeroSerie: 'BAL-29011-W',
    marca: 'Welmy',
    modelo: 'W300 A',
    categoria: 'Equipamentos de Saúde',
    status: 'Ativo',
    unidade: 'Rede Municipal de Diadema',
    setor: 'Triagem - UBS Serraria',
    sala: 'Consultório de Enfermagem',
    responsavel: 'Não atribuído',
    dataAquisicao: '12/04/2023',
    valorAquisicao: 'R$ 2.400,00',
    observacao: 'Balança com régua antropométrica acoplada, homologada pelo INMETRO.',
  },
  {
    id: '7',
    nome: 'Nobreak Senoidal 3kVA para Servidor',
    tombamento: '2023017',
    numeroSerie: 'NBK-99014-SMS',
    marca: 'NHS',
    modelo: 'Laser Prime 3000',
    categoria: 'Climatização e Apoio',
    status: 'Baixado',
    unidade: 'Sede da Secretaria de Saúde',
    setor: 'Departamento de TI - Sede SMS',
    sala: 'Sala do CPD / Servidores',
    responsavel: 'Não atribuído',
    dataAquisicao: '15/06/2019',
    valorAquisicao: 'R$ 5.100,00',
    observacao: 'Bem baixado por obsolescência e laudo técnico que indicou inviabilidade de reparo.',
  },
];

const STORAGE_KEY = '@epatrimonio_dados_bens';

let memoriaBens: BemPatrimonial[] | null = null;

function carregarBens(): BemPatrimonial[] {
  if (memoriaBens) return memoriaBens;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const salvo = window.localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        memoriaBens = JSON.parse(salvo);
        if (memoriaBens && memoriaBens.length > 0) return memoriaBens;
      }
    } catch {}
  }
  memoriaBens = [...DADOS_INICIAIS];
  return memoriaBens;
}

function salvarBens(bens: BemPatrimonial[]) {
  memoriaBens = bens;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bens));
    } catch {}
  }
}

export function obterTodosPatrimonios(): BemPatrimonial[] {
  return carregarBens();
}

export function obterPatrimonioPorId(id: string): BemPatrimonial | null {
  const bens = carregarBens();
  return bens.find((b) => b.id === id) || null;
}

export function atribuirResponsavel(id: string, servidor: ServidorPublico | null): BemPatrimonial | null {
  const bens = carregarBens();
  const index = bens.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const atualizado: BemPatrimonial = {
    ...bens[index],
    responsavel: servidor ? servidor.nome : 'Não atribuído',
    responsavelDetalhes: servidor || null,
  };

  bens[index] = atualizado;
  salvarBens([...bens]);
  return atualizado;
}

export function adicionarNovoPatrimonio(item: Partial<BemPatrimonial>): BemPatrimonial {
  const bens = carregarBens();
  const novo: BemPatrimonial = {
    id: String(Date.now()),
    nome: item.nome || 'Novo Material Permanente',
    tombamento: item.tombamento || String(Math.floor(1000000 + Math.random() * 9000000)),
    setor: item.setor || 'Almoxarifado Central - Sede SMS',
    status: (item.status as any) || 'Ativo',
    categoria: item.categoria || 'Informática',
    responsavel: item.responsavel || 'Não atribuído',
    responsavelDetalhes: item.responsavelDetalhes || null,
    numeroSerie: item.numeroSerie || 'N/A',
    marca: item.marca || 'N/A',
    modelo: item.modelo || 'N/A',
    unidade: item.unidade || 'Secretaria Municipal da Saúde de Diadema',
    sala: item.sala || 'Almoxarifado',
    dataAquisicao: item.dataAquisicao || new Date().toLocaleDateString('pt-BR'),
    valorAquisicao: item.valorAquisicao || 'R$ 0,00',
    observacao: item.observacao || 'Cadastrado no sistema de gestão patrimonial.',
  };

  const listaAtualizada = [novo, ...bens];
  salvarBens(listaAtualizada);
  return novo;
}
