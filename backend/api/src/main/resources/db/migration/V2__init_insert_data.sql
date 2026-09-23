-- ============================================================
-- 1. DADOS INICIAIS
-- ============================================================

INSERT INTO perfil (nome, descricao)
VALUES
    ('ADMIN', 'Administrador do sistema'),
    ('EDITOR', 'Usuário com permissão de edição'),
    ('LEITOR', 'Usuário com permissão de leitura');

INSERT INTO permissao (codigo, descricao)
VALUES
    ('PATRIMONIO_LER', 'Consultar patrimônios'),
    ('PATRIMONIO_CRIAR', 'Cadastrar patrimônios'),
    ('PATRIMONIO_EDITAR', 'Editar patrimônios'),
    ('PATRIMONIO_EXCLUIR', 'Excluir patrimônios'),

    ('MOVIMENTACAO_LER', 'Consultar movimentações'),
    ('MOVIMENTACAO_CRIAR', 'Registrar movimentações'),

    ('UNIDADE_LER', 'Consultar unidades'),
    ('UNIDADE_GERENCIAR', 'Gerenciar unidades'),

    ('USUARIO_LER', 'Consultar usuários'),
    ('USUARIO_GERENCIAR', 'Gerenciar usuários'),

    ('INVENTARIO_LER', 'Consultar inventários'),
    ('INVENTARIO_GERENCIAR', 'Gerenciar inventários'),

    ('AUDITORIA_LER', 'Consultar registros de auditoria');

-- LEITOR
INSERT INTO perfil_permissao (perfil_id, permissao_id)
SELECT p.id, pm.id
FROM perfil p
CROSS JOIN permissao pm
WHERE p.nome = 'LEITOR'
  AND pm.codigo IN (
      'PATRIMONIO_LER',
      'MOVIMENTACAO_LER',
      'UNIDADE_LER',
      'INVENTARIO_LER'
  );

-- EDITOR
INSERT INTO perfil_permissao (perfil_id, permissao_id)
SELECT p.id, pm.id
FROM perfil p
CROSS JOIN permissao pm
WHERE p.nome = 'EDITOR'
  AND pm.codigo IN (
      'PATRIMONIO_LER',
      'PATRIMONIO_CRIAR',
      'PATRIMONIO_EDITAR',
      'MOVIMENTACAO_LER',
      'MOVIMENTACAO_CRIAR',
      'UNIDADE_LER',
      'INVENTARIO_LER',
      'INVENTARIO_GERENCIAR'
  );

-- ADMIN
INSERT INTO perfil_permissao (perfil_id, permissao_id)
SELECT p.id, pm.id
FROM perfil p
CROSS JOIN permissao pm
WHERE p.nome = 'ADMIN';

-- Situações iniciais
INSERT INTO situacao (nome, descricao)
VALUES
    ('ATIVO', 'Bem em uso'),
    ('DISPONIVEL', 'Bem disponível para utilização'),
    ('MANUTENCAO', 'Bem em manutenção'),
    ('BAIXADO', 'Bem baixado do patrimônio'),
    ('EM_TRANSFERENCIA', 'Bem em processo de transferência'),
    ('NAO_LOCALIZADO', 'Bem não localizado no inventário');
