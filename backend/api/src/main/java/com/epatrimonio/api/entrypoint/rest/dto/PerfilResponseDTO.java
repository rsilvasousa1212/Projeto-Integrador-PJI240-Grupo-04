package com.epatrimonio.api.entrypoint.rest.dto;

import com.epatrimonio.api.dataprovider.database.entity.PerfilEntity;

public record PerfilResponseDTO(Long id, String nome, String descricao, Boolean ativo) {
    public static PerfilResponseDTO from(PerfilEntity entity) {
        return new PerfilResponseDTO(entity.getId(), entity.getNome(), entity.getDescricao(), entity.getAtivo());
    }
}