export interface ServidorPublico {
  id: string;
  matricula: string;
  nome: string;
  email: string;
  cargo: string;
  setor: string;
}

export const SERVIDORES_SMS: ServidorPublico[] = [
  {
    id: '1',
    matricula: '10115-4',
    nome: 'Renato da Silva de Sousa',
    email: 'renato.sousa@saude.diadema.sp.gov.br',
    cargo: 'Gestor de Patrimônio e Logística',
    setor: 'Almoxarifado Central - Sede SMS',
  },
  {
    id: '2',
    matricula: '10921-8',
    nome: 'Juliana Mendes Ramos',
    email: 'juliana.ramos@saude.diadema.sp.gov.br',
    cargo: 'Enfermeira Responsável de Imunização',
    setor: 'Sala de Vacinas - UBS Eldorado',
  },
  {
    id: '3',
    matricula: '10482-1',
    nome: 'Carlos Eduardo da Silva',
    email: 'carlos.silva@saude.diadema.sp.gov.br',
    cargo: 'Farmacêutico Chefe',
    setor: 'Farmácia Central Municipal',
  },
  {
    id: '4',
    matricula: '11044-6',
    nome: 'Mariana Albuquerque Prado',
    email: 'mariana.prado@saude.diadema.sp.gov.br',
    cargo: 'Gerente de Unidade Básica',
    setor: 'Recepção - UBS Centro',
  },
  {
    id: '5',
    matricula: '10833-2',
    nome: 'Roberto Alves Moreira',
    email: 'roberto.moreira@saude.diadema.sp.gov.br',
    cargo: 'Supervisor de TI e Redes',
    setor: 'Departamento de TI - Sede SMS',
  },
  {
    id: '6',
    matricula: '11209-0',
    nome: 'Patrícia Souza Lima',
    email: 'patricia.lima@saude.diadema.sp.gov.br',
    cargo: 'Técnica de Enfermagem (CME)',
    setor: 'Central de Esterilização - UBS Piraporinha',
  },
  {
    id: '7',
    matricula: '10745-7',
    nome: 'Fernando Henrique Costa',
    email: 'fernando.costa@saude.diadema.sp.gov.br',
    cargo: 'Coordenador de Regulação Ambulatorial',
    setor: 'Central de Regulação e Vagas',
  },
  {
    id: '8',
    matricula: '11350-3',
    nome: 'Aline Cristina Barbosa',
    email: 'aline.barbosa@saude.diadema.sp.gov.br',
    cargo: 'Técnica em Saúde / Triagem',
    setor: 'Triagem - UBS Serraria',
  },
];

export function buscarServidores(termo: string): ServidorPublico[] {
  if (!termo || !termo.trim()) return SERVIDORES_SMS;
  const t = termo.toLowerCase().trim();
  return SERVIDORES_SMS.filter((s) =>
    s.nome.toLowerCase().includes(t) ||
    s.email.toLowerCase().includes(t) ||
    s.matricula.toLowerCase().includes(t) ||
    s.cargo.toLowerCase().includes(t) ||
    s.setor.toLowerCase().includes(t)
  );
}
