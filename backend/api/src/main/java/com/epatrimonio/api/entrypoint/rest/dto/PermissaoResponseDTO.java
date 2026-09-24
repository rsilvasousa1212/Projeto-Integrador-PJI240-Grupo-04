package com.epatrimonio.api.entrypoint.rest.dto;

import com.epatrimonio.api.dataprovider.database.entity.PermissaoEntity;

public record PermissaoResponseDTO(Long id, String codigo, String descricao) {
    public static PermissaoResponseDTO from(PermissaoEntity entity) {
        return new PermissaoResponseDTO(entity.getId(), entity.getCodigo(), entity.getDescricao());
    }
}