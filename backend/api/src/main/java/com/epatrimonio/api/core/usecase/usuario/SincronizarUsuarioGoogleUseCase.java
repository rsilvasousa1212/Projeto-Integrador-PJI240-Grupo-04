package com.epatrimonio.api.core.usecase.usuario;

import com.epatrimonio.api.core.domain.Usuario;

public record SincronizarUsuarioGoogleUseCase(UsuarioRepositoryGateway usuarioRepository) {

    public interface UsuarioRepositoryGateway{
        Usuario buscarPorEmail(String email);
        Usuario salvar(Usuario usuario);
    }

    public Usuario executar(Usuario usuarioGoogle){
        Usuario existente = usuarioRepository.buscarPorEmail(usuarioGoogle.email());

        if (existente != null){
            return existente;
        }

        return usuarioRepository.salvar(usuarioGoogle);
    }
}
