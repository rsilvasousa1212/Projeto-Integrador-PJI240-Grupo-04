CREATE TABLE responsavel (
                             id            BIGSERIAL PRIMARY KEY,
                             usuario_id    BIGINT UNIQUE, -- UNIQUE garante o relacionamento 1:1 estrito
                             unidade_id    BIGINT NOT NULL,
                             setor_id      BIGINT NOT NULL,

                             nome          VARCHAR(150) NOT NULL,
                             cpf           VARCHAR(11) UNIQUE,
                             matricula     VARCHAR(10) UNIQUE,

                             ativo         BOOLEAN NOT NULL DEFAULT TRUE,
                             criado_em     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                             CONSTRAINT fk_responsavel_usuario
                                 FOREIGN KEY (usuario_id)
                                     REFERENCES usuario(id)
                                     ON DELETE SET NULL, -- Se o usuário for deletado, apaga só o vínculo de login

                             CONSTRAINT fk_responsavel_unidade
                                 FOREIGN KEY (unidade_id)
                                     REFERENCES unidade(id),

                             CONSTRAINT fk_responsavel_setor
                                 FOREIGN KEY (setor_id)
                                     REFERENCES setor(id)
);