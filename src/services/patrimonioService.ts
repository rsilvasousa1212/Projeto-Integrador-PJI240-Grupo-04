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

export type TipoAcaoAuditoria = 'CADASTRO' | 'EDICAO' | 'EXCLUSAO' | 'ATRIBUICAO' | 'TRANSFERENCIA';

export interface AcaoAuditoria {
  id: string;
  tipo: TipoAcaoAuditoria;
  titulo: string;
  descricao: string;
  patrimonioNome: string;
  tombamento: string;
  usuarioNome: string;
  usuarioEmail: string;
  dataHora: string;
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

const HISTORICO_INICIAL: AcaoAuditoria[] = [
  {
    id: 'aud-1',
    tipo: 'CADASTRO',
    titulo: 'Tombamento Inicial de Lote',
    descricao: 'Cadastro oficial de material permanente adquirido pelo pregão municipal.',
    patrimonioNome: 'Câmara de Conservação de Vacinas 280L',
    tombamento: '2023011',
    usuarioNome: 'Renato da Silva de Sousa',
    usuarioEmail: 'renato.sousa@saude.diadema.sp.gov.br',
    dataHora: '15/10/2026 09:30',
  },
  {
    id: 'aud-2',
    tipo: 'ATRIBUICAO',
    titulo: 'Definição de Custódia Inicial',
    descricao: 'Termo de responsabilidade gerado para a servidora responsável de imunização da unidade.',
    patrimonioNome: 'Câmara de Conservação de Vacinas 280L',
    tombamento: '2023011',
    usuarioNome: 'Renato da Silva de Sousa',
    usuarioEmail: 'renato.sousa@saude.diadema.sp.gov.br',
    dataHora: '15/10/2026 10:15',
  },
  {
    id: 'aud-3',
    tipo: 'TRANSFERENCIA',
    titulo: 'Solicitação de Transferência',
    descricao: 'Remessa enviada do Almoxarifado Central com destino à Farmácia Central Municipal.',
    patrimonioNome: 'Impressora Térmica de Etiquetas Zebra',
    tombamento: '2023015',
    usuarioNome: 'Renato da Silva de Sousa',
    usuarioEmail: 'renato.sousa@saude.diadema.sp.gov.br',
    dataHora: '15/10/2026 14:00',
  },
  {
    id: 'aud-4',
    tipo: 'EDICAO',
    titulo: 'Atualização de Estado de Conservação',
    descricao: 'Status alterado para "Em Manutenção" para envio à assistência técnica autorizada.',
    patrimonioNome: 'Autoclave Digital de Bancada 21L',
    tombamento: '2023014',
    usuarioNome: 'Renato da Silva de Sousa',
    usuarioEmail: 'renato.sousa@saude.diadema.sp.gov.br',
    dataHora: '15/10/2026 15:45',
  },
];

const STORAGE_KEY_BENS = '@epatrimonio_dados_bens';
const STORAGE_KEY_AUDITORIA = '@epatrimonio_historico_auditoria';

let memoriaBens: BemPatrimonial[] | null = null;
let memoriaAuditoria: AcaoAuditoria[] | null = null;

function carregarBens(): BemPatrimonial[] {
  if (memoriaBens) return memoriaBens;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const salvo = window.localStorage.getItem(STORAGE_KEY_BENS);
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
      window.localStorage.setItem(STORAGE_KEY_BENS, JSON.stringify(bens));
    } catch {}
  }
}

function carregarAuditoria(): AcaoAuditoria[] {
  if (memoriaAuditoria) return memoriaAuditoria;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const salvo = window.localStorage.getItem(STORAGE_KEY_AUDITORIA);
      if (salvo) {
        memoriaAuditoria = JSON.parse(salvo);
        if (memoriaAuditoria && memoriaAuditoria.length > 0) return memoriaAuditoria;
      }
    } catch {}
  }
  memoriaAuditoria = [...HISTORICO_INICIAL];
  return memoriaAuditoria;
}

function salvarAuditoria(lista: AcaoAuditoria[]) {
  memoriaAuditoria = lista;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY_AUDITORIA, JSON.stringify(lista));
    } catch {}
  }
}

function formatarDataHoraAtual(): string {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, '0');
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const ano = agora.getFullYear();
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

export function registrarAcaoAuditoria(
  acao: Omit<AcaoAuditoria, 'id' | 'dataHora'>
): AcaoAuditoria {
  const lista = carregarAuditoria();
  const novoRegistro: AcaoAuditoria = {
    ...acao,
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    dataHora: formatarDataHoraAtual(),
  };

  const atualizada = [novoRegistro, ...lista];
  salvarAuditoria(atualizada);
  return novoRegistro;
}

export function obterHistoricoAuditoria(): AcaoAuditoria[] {
  return carregarAuditoria();
}

export function obterTodosPatrimonios(): BemPatrimonial[] {
  return carregarBens();
}

export function obterPatrimonioPorId(id: string): BemPatrimonial | null {
  const bens = carregarBens();
  return bens.find((b) => b.id === id) || null;
}

export function atribuirResponsavel(
  id: string,
  servidor: ServidorPublico | null,
  autor?: { nome: string; email: string }
): BemPatrimonial | null {
  const bens = carregarBens();
  const index = bens.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const anterior = bens[index];
  const atualizado: BemPatrimonial = {
    ...anterior,
    responsavel: servidor ? servidor.nome : 'Não atribuído',
    responsavelDetalhes: servidor || null,
  };

  bens[index] = atualizado;
  salvarBens([...bens]);

  registrarAcaoAuditoria({
    tipo: 'ATRIBUICAO',
    titulo: servidor ? 'Atribuição de Custódia' : 'Remoção de Custódia',
    descricao: servidor
      ? `Bem atribuído ao servidor ${servidor.nome} (${servidor.cargo} - Matrícula: ${servidor.matricula}).`
      : `Custódia do bem foi alterada para "Não atribuído".`,
    patrimonioNome: atualizado.nome,
    tombamento: atualizado.tombamento,
    usuarioNome: autor?.nome || 'Servidor Municipal',
    usuarioEmail: autor?.email || 'gestao.patrimonio@saude.diadema.sp.gov.br',
  });

  return atualizado;
}

export function adicionarNovoPatrimonio(
  item: Partial<BemPatrimonial>,
  autor?: { nome: string; email: string }
): BemPatrimonial {
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
    sala: item.sala || 'Geral',
    dataAquisicao: item.dataAquisicao || new Date().toLocaleDateString('pt-BR'),
    valorAquisicao: item.valorAquisicao || 'R$ 0,00',
    observacao: item.observacao || 'Cadastrado no sistema de gestão patrimonial.',
  };

  const listaAtualizada = [novo, ...bens];
  salvarBens(listaAtualizada);

  registrarAcaoAuditoria({
    tipo: 'CADASTRO',
    titulo: 'Cadastro de Patrimônio',
    descricao: `Inclusão do bem "${novo.nome}" com tombamento nº ${novo.tombamento} no setor ${novo.setor}.`,
    patrimonioNome: novo.nome,
    tombamento: novo.tombamento,
    usuarioNome: autor?.nome || 'Servidor Municipal',
    usuarioEmail: autor?.email || 'gestao.patrimonio@saude.diadema.sp.gov.br',
  });

  return novo;
}

export function atualizarPatrimonio(
  id: string,
  dados: Partial<BemPatrimonial>,
  autor?: { nome: string; email: string }
): BemPatrimonial | null {
  const bens = carregarBens();
  const index = bens.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const anterior = bens[index];
  const atualizado: BemPatrimonial = {
    ...anterior,
    ...dados,
    id: anterior.id,
  };

  bens[index] = atualizado;
  salvarBens([...bens]);

  registrarAcaoAuditoria({
    tipo: 'EDICAO',
    titulo: 'Alteração de Dados Patrimoniais',
    descricao: `Dados do bem "${atualizado.nome}" (Tombamento: ${atualizado.tombamento}) foram atualizados. Status: ${atualizado.status}, Setor: ${atualizado.setor}.`,
    patrimonioNome: atualizado.nome,
    tombamento: atualizado.tombamento,
    usuarioNome: autor?.nome || 'Servidor Municipal',
    usuarioEmail: autor?.email || 'gestao.patrimonio@saude.diadema.sp.gov.br',
  });

  return atualizado;
}

export function excluirPatrimonio(
  id: string,
  autor?: { nome: string; email: string }
): boolean {
  const bens = carregarBens();
  const item = bens.find((b) => b.id === id);
  if (!item) return false;

  const novaLista = bens.filter((b) => b.id !== id);
  salvarBens(novaLista);

  registrarAcaoAuditoria({
    tipo: 'EXCLUSAO',
    titulo: 'Exclusão de Patrimônio',
    descricao: `Patrimônio "${item.nome}" (Tombamento: ${item.tombamento}) foi removido do inventário da SMS Diadema.`,
    patrimonioNome: item.nome,
    tombamento: item.tombamento,
    usuarioNome: autor?.nome || 'Servidor Municipal',
    usuarioEmail: autor?.email || 'gestao.patrimonio@saude.diadema.sp.gov.br',
  });

  return true;
}

export function obterMetricasPatrimonio() {
  const bens = carregarBens();
  const auditoria = carregarAuditoria();

  let valorTotalCalculado = 0;
  let ativos = 0;
  let manutencao = 0;
  let baixados = 0;

  bens.forEach((b) => {
    if (b.status === 'Ativo') ativos++;
    else if (b.status === 'Em Manutenção') manutencao++;
    else if (b.status === 'Baixado') baixados++;

    const limpo = b.valorAquisicao.replace(/[^\d,]/g, '').replace(',', '.');
    const valorNum = parseFloat(limpo) || 0;
    valorTotalCalculado += valorNum;
  });

  return {
    totalBens: bens.length,
    valorTotal: valorTotalCalculado,
    ativos,
    manutencao,
    baixados,
    totalAcoes: auditoria.length,
  };
}
