package com.epatrimonio.api.entrypoint.rest.dto;

import com.epatrimonio.api.dataprovider.database.entity.SituacaoEntity;

public record SituacaoResponseDTO(Long id, String nome, String descricao, Boolean ativo) {
    public static SituacaoResponseDTO from(SituacaoEntity entity) {
        return new SituacaoResponseDTO(entity.getId(), entity.getNome(), entity.getDescricao(), entity.getAtivo());
    }
}