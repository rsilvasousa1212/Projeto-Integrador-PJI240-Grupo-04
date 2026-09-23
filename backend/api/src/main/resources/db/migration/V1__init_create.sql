-- ============================================================
-- ePatrimônio
-- V1__init_create.sql
-- PostgreSQL / Supabase
-- ============================================================

-- ============================================================
-- 1. USUÁRIOS E AUTORIZAÇÃO
-- ============================================================

CREATE TABLE usuario (
    id              BIGSERIAL PRIMARY KEY,
    google_id       VARCHAR(100) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    nome            VARCHAR(150) NOT NULL,
    foto_url        VARCHAR(500),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE perfil (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(50) NOT NULL UNIQUE,
    descricao       VARCHAR(255),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE permissao (
    id              BIGSERIAL PRIMARY KEY,
    codigo          VARCHAR(100) NOT NULL UNIQUE,
    descricao       VARCHAR(255)
);

CREATE TABLE usuario_perfil (
    usuario_id      BIGINT NOT NULL,
    perfil_id       BIGINT NOT NULL,

    PRIMARY KEY (usuario_id, perfil_id),

    CONSTRAINT fk_usuario_perfil_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario_perfil_perfil
        FOREIGN KEY (perfil_id)
        REFERENCES perfil(id)
        ON DELETE CASCADE
);

CREATE TABLE perfil_permissao (
    perfil_id       BIGINT NOT NULL,
    permissao_id    BIGINT NOT NULL,

    PRIMARY KEY (perfil_id, permissao_id),

    CONSTRAINT fk_perfil_permissao_perfil
        FOREIGN KEY (perfil_id)
        REFERENCES perfil(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_perfil_permissao_permissao
        FOREIGN KEY (permissao_id)
        REFERENCES permissao(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 2. ESTRUTURA ORGANIZACIONAL / UNIDADES
-- ============================================================

CREATE TABLE unidade (
    id              BIGSERIAL PRIMARY KEY,
    codigo          VARCHAR(30) NOT NULL UNIQUE,
    nome            VARCHAR(150) NOT NULL,
    descricao       VARCHAR(255),
    endereco        VARCHAR(255),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE andar (
    id              BIGSERIAL PRIMARY KEY,
    unidade_id      BIGINT NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    descricao       VARCHAR(255),

    CONSTRAINT fk_andar_unidade
        FOREIGN KEY (unidade_id)
        REFERENCES unidade(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_andar_unidade_nome
        UNIQUE (unidade_id, nome)
);

CREATE TABLE sala (
    id              BIGSERIAL PRIMARY KEY,
    andar_id        BIGINT NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    descricao       VARCHAR(255),

    CONSTRAINT fk_sala_andar
        FOREIGN KEY (andar_id)
        REFERENCES andar(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_sala_andar_nome
        UNIQUE (andar_id, nome)
);

CREATE TABLE setor (
    id              BIGSERIAL PRIMARY KEY,
    unidade_id      BIGINT NOT NULL,
    nome            VARCHAR(150) NOT NULL,
    descricao       VARCHAR(255),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_setor_unidade
        FOREIGN KEY (unidade_id)
        REFERENCES unidade(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_setor_unidade_nome
        UNIQUE (unidade_id, nome)
);

CREATE TABLE usuario_unidade (
    usuario_id      BIGINT NOT NULL,
    unidade_id      BIGINT NOT NULL,

    PRIMARY KEY (usuario_id, unidade_id),

    CONSTRAINT fk_usuario_unidade_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario_unidade_unidade
        FOREIGN KEY (unidade_id)
        REFERENCES unidade(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 3. CADASTROS DO PATRIMÔNIO
-- ============================================================

CREATE TABLE categoria (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL UNIQUE,
    descricao       VARCHAR(255),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE marca (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL UNIQUE,
    ativo           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE modelo (
    id              BIGSERIAL PRIMARY KEY,
    marca_id        BIGINT NOT NULL,
    nome            VARCHAR(150) NOT NULL,
    descricao       VARCHAR(255),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_modelo_marca
        FOREIGN KEY (marca_id)
        REFERENCES marca(id),

    CONSTRAINT uk_modelo_marca_nome
        UNIQUE (marca_id, nome)
);

CREATE TABLE situacao (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL UNIQUE,
    descricao       VARCHAR(255),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE
);


-- ============================================================
-- 4. PATRIMÔNIO
-- ============================================================

CREATE TABLE patrimonio (
    id                  BIGSERIAL PRIMARY KEY,

    tombamento           VARCHAR(50) NOT NULL UNIQUE,

    categoria_id         BIGINT NOT NULL,
    marca_id             BIGINT,
    modelo_id            BIGINT,

    numero_serie         VARCHAR(150),
    descricao             VARCHAR(255),

    situacao_id          BIGINT NOT NULL,

    unidade_id           BIGINT NOT NULL,
    andar_id             BIGINT,
    sala_id              BIGINT,
    setor_id             BIGINT,

    responsavel_id       BIGINT,

    data_aquisicao       DATE,
    valor_aquisicao      NUMERIC(15,2),

    observacao            TEXT,

    ativo                 BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_patrimonio_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categoria(id),

    CONSTRAINT fk_patrimonio_marca
        FOREIGN KEY (marca_id)
        REFERENCES marca(id),

    CONSTRAINT fk_patrimonio_modelo
        FOREIGN KEY (modelo_id)
        REFERENCES modelo(id),

    CONSTRAINT fk_patrimonio_situacao
        FOREIGN KEY (situacao_id)
        REFERENCES situacao(id),

    CONSTRAINT fk_patrimonio_unidade
        FOREIGN KEY (unidade_id)
        REFERENCES unidade(id),

    CONSTRAINT fk_patrimonio_andar
        FOREIGN KEY (andar_id)
        REFERENCES andar(id),

    CONSTRAINT fk_patrimonio_sala
        FOREIGN KEY (sala_id)
        REFERENCES sala(id),

    CONSTRAINT fk_patrimonio_setor
        FOREIGN KEY (setor_id)
        REFERENCES setor(id),

    CONSTRAINT fk_patrimonio_responsavel
        FOREIGN KEY (responsavel_id)
        REFERENCES usuario(id)
);


-- ============================================================
-- 5. MOVIMENTAÇÃO / TRANSFERÊNCIA
-- ============================================================

CREATE TABLE movimentacao (
    id                      BIGSERIAL PRIMARY KEY,

    patrimonio_id           BIGINT NOT NULL,

    unidade_origem_id       BIGINT,
    andar_origem_id         BIGINT,
    sala_origem_id          BIGINT,
    setor_origem_id         BIGINT,

    unidade_destino_id      BIGINT NOT NULL,
    andar_destino_id        BIGINT,
    sala_destino_id         BIGINT,
    setor_destino_id        BIGINT,

    responsavel_anterior_id BIGINT,
    responsavel_novo_id     BIGINT,

    data_movimentacao       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    usuario_id              BIGINT NOT NULL,

    motivo                  VARCHAR(255),
    observacao              TEXT,

    CONSTRAINT fk_movimentacao_patrimonio
        FOREIGN KEY (patrimonio_id)
        REFERENCES patrimonio(id),

    CONSTRAINT fk_mov_origem_unidade
        FOREIGN KEY (unidade_origem_id)
        REFERENCES unidade(id),

    CONSTRAINT fk_mov_origem_andar
        FOREIGN KEY (andar_origem_id)
        REFERENCES andar(id),

    CONSTRAINT fk_mov_origem_sala
        FOREIGN KEY (sala_origem_id)
        REFERENCES sala(id),

    CONSTRAINT fk_mov_origem_setor
        FOREIGN KEY (setor_origem_id)
        REFERENCES setor(id),

    CONSTRAINT fk_mov_destino_unidade
        FOREIGN KEY (unidade_destino_id)
        REFERENCES unidade(id),

    CONSTRAINT fk_mov_destino_andar
        FOREIGN KEY (andar_destino_id)
        REFERENCES andar(id),

    CONSTRAINT fk_mov_destino_sala
        FOREIGN KEY (sala_destino_id)
        REFERENCES sala(id),

    CONSTRAINT fk_mov_destino_setor
        FOREIGN KEY (setor_destino_id)
        REFERENCES setor(id),

    CONSTRAINT fk_mov_responsavel_anterior
        FOREIGN KEY (responsavel_anterior_id)
        REFERENCES usuario(id),

    CONSTRAINT fk_mov_responsavel_novo
        FOREIGN KEY (responsavel_novo_id)
        REFERENCES usuario(id),

    CONSTRAINT fk_mov_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
);


-- ============================================================
-- 6. INVENTÁRIO
-- ============================================================

CREATE TABLE inventario (
    id                  BIGSERIAL PRIMARY KEY,

    unidade_id          BIGINT NOT NULL,

    descricao           VARCHAR(255) NOT NULL,

    data_inicio         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_fim            TIMESTAMPTZ,

    status              VARCHAR(30) NOT NULL DEFAULT 'ABERTO',

    responsavel_id      BIGINT NOT NULL,

    observacao          TEXT,

    criado_em           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventario_unidade
        FOREIGN KEY (unidade_id)
        REFERENCES unidade(id),

    CONSTRAINT fk_inventario_responsavel
        FOREIGN KEY (responsavel_id)
        REFERENCES usuario(id),

    CONSTRAINT ck_inventario_status
        CHECK (status IN ('ABERTO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'))
);

CREATE TABLE inventario_item (
    id                  BIGSERIAL PRIMARY KEY,

    inventario_id       BIGINT NOT NULL,
    patrimonio_id       BIGINT NOT NULL,

    encontrado           BOOLEAN NOT NULL DEFAULT FALSE,

    data_conferencia     TIMESTAMPTZ,

    usuario_conferencia  BIGINT,

    observacao           TEXT,

    CONSTRAINT fk_inventario_item_inventario
        FOREIGN KEY (inventario_id)
        REFERENCES inventario(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_inventario_item_patrimonio
        FOREIGN KEY (patrimonio_id)
        REFERENCES patrimonio(id),

    CONSTRAINT fk_inventario_item_usuario
        FOREIGN KEY (usuario_conferencia)
        REFERENCES usuario(id),

    CONSTRAINT uk_inventario_patrimonio
        UNIQUE (inventario_id, patrimonio_id)
);


-- ============================================================
-- 7. AUDITORIA
-- ============================================================

CREATE TABLE auditoria (
    id                  BIGSERIAL PRIMARY KEY,

    usuario_id          BIGINT,
    entidade            VARCHAR(100) NOT NULL,
    entidade_id         BIGINT,

    operacao             VARCHAR(30) NOT NULL,

    data_hora            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    dados_anteriores     JSONB,
    dados_novos          JSONB,

    ip                   INET,

    CONSTRAINT fk_auditoria_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
);


-- ============================================================
-- 8. ÍNDICES
-- ============================================================

CREATE INDEX idx_patrimonio_categoria
    ON patrimonio(categoria_id);

CREATE INDEX idx_patrimonio_marca
    ON patrimonio(marca_id);

CREATE INDEX idx_patrimonio_modelo
    ON patrimonio(modelo_id);

CREATE INDEX idx_patrimonio_situacao
    ON patrimonio(situacao_id);

CREATE INDEX idx_patrimonio_unidade
    ON patrimonio(unidade_id);

CREATE INDEX idx_patrimonio_setor
    ON patrimonio(setor_id);

CREATE INDEX idx_patrimonio_responsavel
    ON patrimonio(responsavel_id);

CREATE INDEX idx_patrimonio_numero_serie
    ON patrimonio(numero_serie);

CREATE INDEX idx_movimentacao_patrimonio
    ON movimentacao(patrimonio_id);

CREATE INDEX idx_movimentacao_data
    ON movimentacao(data_movimentacao);

CREATE INDEX idx_movimentacao_usuario
    ON movimentacao(usuario_id);

CREATE INDEX idx_inventario_unidade
    ON inventario(unidade_id);

CREATE INDEX idx_inventario_item_patrimonio
    ON inventario_item(patrimonio_id);

CREATE INDEX idx_auditoria_entidade
    ON auditoria(entidade, entidade_id);

CREATE INDEX idx_auditoria_usuario
    ON auditoria(usuario_id);

CREATE INDEX idx_auditoria_data
    ON auditoria(data_hora);


