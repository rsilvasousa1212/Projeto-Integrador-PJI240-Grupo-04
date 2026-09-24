package com.epatrimonio.api.entrypoint.rest.dto;

import com.epatrimonio.api.core.domain.Usuario;

public record UsuarioResponseDTO(
    Long id,
    String nome,
    String email
) {
    public static UsuarioResponseDTO from(Usuario usuario) {
        return new UsuarioResponseDTO(usuario.id(), usuario.nome(), usuario.email());
    }
}