import {
  adicionarNovoPatrimonio,
  atribuirResponsavel,
  atualizarPatrimonio,
  excluirPatrimonio,
  obterHistoricoAuditoria,
  obterMetricasPatrimonio,
  obterPatrimonioPorId,
  obterTodosPatrimonios,
  sincronizarAuditoriaComBanco,
  sincronizarPatrimoniosComBanco,
} from '../services/patrimonioService';
import { SERVIDORES_SMS } from '../services/servidoresService';

describe('patrimonioService - Gestão e Auditoria de Patrimônio SMS Diadema', () => {
  it('deve listar todos os patrimônios iniciais da rede', () => {
    const lista = obterTodosPatrimonios();
    expect(lista.length).toBeGreaterThan(0);
    expect(lista[0]).toHaveProperty('tombamento');
    expect(lista[0]).toHaveProperty('nome');
  });

  it('deve encontrar um patrimônio existente por ID', () => {
    const todos = obterTodosPatrimonios();
    const primeiro = todos[0];
    const encontrado = obterPatrimonioPorId(primeiro.id);
    expect(encontrado).not.toBeNull();
    expect(encontrado?.tombamento).toBe(primeiro.tombamento);
  });

  it('deve retornar null ao buscar patrimônio com ID inexistente', () => {
    const resultado = obterPatrimonioPorId('id-inexistente-xyz');
    expect(resultado).toBeNull();
  });

  it('deve calcular métricas consolidadas e valor contábil corretamente', () => {
    const metricas = obterMetricasPatrimonio();
    expect(metricas.totalBens).toBeGreaterThan(0);
    expect(metricas.valorTotal).toBeGreaterThan(0);
    expect(typeof metricas.ativos).toBe('number');
    expect(typeof metricas.manutencao).toBe('number');
    expect(typeof metricas.totalAcoes).toBe('number');
  });

  it('deve cadastrar um novo patrimônio e registrar trilha de auditoria', () => {
    const tomboUnico = `SMS-${Date.now()}`;
    const novo = adicionarNovoPatrimonio({
      nome: 'Monitor Multiparâmetro Hospitalar',
      tombamento: tomboUnico,
      categoria: 'Equipamentos de Saúde',
      marca: 'Dixtal',
      modelo: 'DX 2020',
      numeroSerie: 'DX-994821',
      setor: 'UBS Eldorado - Sala de Vacinas',
      sala: 'Sala de Emergência',
      responsavel: 'Não atribuído',
      valorAquisicao: 'R$ 15.000,00',
      observacao: 'Equipamento para monitorização de sinais vitais.',
    });

    expect(novo).toHaveProperty('id');
    expect(novo.tombamento).toBe(tomboUnico);

    const recuperado = obterPatrimonioPorId(novo.id);
    expect(recuperado).not.toBeNull();
    expect(recuperado?.nome).toBe('Monitor Multiparâmetro Hospitalar');

    const auditoria = obterHistoricoAuditoria();
    const registroAuditoria = auditoria.find((a) => a.tombamento === tomboUnico);
    expect(registroAuditoria).toBeDefined();
    expect(registroAuditoria?.tipo).toBe('CADASTRO');
  });

  it('deve atualizar dados do patrimônio e gerar log de edição', () => {
    const todos = obterTodosPatrimonios();
    const item = todos[0];

    const atualizado = atualizarPatrimonio(item.id, {
      status: 'Em Manutenção',
      observacao: 'Enviado para calibração preventiva anual.',
    });

    expect(atualizado).not.toBeNull();
    expect(atualizado?.status).toBe('Em Manutenção');

    const auditoria = obterHistoricoAuditoria();
    const registro = auditoria.find((a) => a.tombamento === item.tombamento && a.tipo === 'EDICAO');
    expect(registro).toBeDefined();
  });

  it('deve atribuir custódia nominal a um servidor público', () => {
    const todos = obterTodosPatrimonios();
    const item = todos[0];
    const servidor = SERVIDORES_SMS[0];

    const alterado = atribuirResponsavel(item.id, servidor);
    expect(alterado).not.toBeNull();
    expect(alterado?.responsavel).toBe(servidor.nome);
    expect(alterado?.responsavelDetalhes?.matricula).toBe(servidor.matricula);

    const auditoria = obterHistoricoAuditoria();
    const registro = auditoria.find(
      (a) => a.tombamento === item.tombamento && a.tipo === 'ATRIBUICAO'
    );
    expect(registro).toBeDefined();
  });

  it('deve excluir um patrimônio com segurança e registrar log de exclusão', () => {
    const tomboTemporario = `EXC-${Date.now()}`;
    const criado = adicionarNovoPatrimonio({
      nome: 'Cadeira Ergonômica Giratória',
      tombamento: tomboTemporario,
      categoria: 'Mobiliário',
      marca: 'Cavaletti',
      modelo: 'Start',
      numeroSerie: 'CV-101',
      setor: 'Recepção - UBS Centro',
      sala: 'Guichê 1',
      responsavel: 'Não atribuído',
      valorAquisicao: 'R$ 650,00',
      observacao: 'Item para teste de baixa patrimonial.',
    });

    const sucesso = excluirPatrimonio(criado.id);
    expect(sucesso).toBe(true);

    const consultado = obterPatrimonioPorId(criado.id);
    expect(consultado).toBeNull();

    const auditoria = obterHistoricoAuditoria();
    const logExclusao = auditoria.find(
      (a) => a.tombamento === tomboTemporario && a.tipo === 'EXCLUSAO'
    );
    expect(logExclusao).toBeDefined();
  });

  it('deve sincronizar bens patrimoniais com a camada de banco de dados e retornar lista', async () => {
    const lista = await sincronizarPatrimoniosComBanco();
    expect(Array.isArray(lista)).toBe(true);
    expect(lista.length).toBeGreaterThan(0);
  });

  it('deve sincronizar histórico de auditoria com o banco de dados em nuvem', async () => {
    const auditoria = await sincronizarAuditoriaComBanco();
    expect(Array.isArray(auditoria)).toBe(true);
    expect(auditoria.length).toBeGreaterThan(0);
  });
});
