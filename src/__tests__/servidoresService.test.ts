import { buscarServidores, SERVIDORES_SMS } from '../services/servidoresService';

describe('servidoresService - Busca de Servidores SMS Diadema', () => {
  it('deve retornar todos os servidores quando o termo de busca estiver vazio', () => {
    const resultado = buscarServidores('');
    expect(resultado).toHaveLength(SERVIDORES_SMS.length);
  });

  it('deve filtrar servidor corretamente por nome', () => {
    const resultado = buscarServidores('Renato');
    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado[0].nome).toContain('Renato');
  });

  it('deve filtrar servidor por matricula', () => {
    const resultado = buscarServidores('10115-4');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].matricula).toBe('10115-4');
  });

  it('deve filtrar servidor por cargo', () => {
    const resultado = buscarServidores('Farmacêutico');
    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado[0].cargo).toContain('Farmacêutico');
  });

  it('deve filtrar servidor por setor', () => {
    const resultado = buscarServidores('UBS Eldorado');
    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado[0].setor).toContain('UBS Eldorado');
  });

  it('deve retornar lista vazia quando nenhum servidor corresponder ao termo', () => {
    const resultado = buscarServidores('TermoInexistente999');
    expect(resultado).toHaveLength(0);
  });
});
