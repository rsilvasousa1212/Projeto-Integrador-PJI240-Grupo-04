package com.epatrimonio.api.core.usecase.usuario;

import com.epatrimonio.api.core.domain.Usuario;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public record SincronizarUsuarioGoogleUseCase(UsuarioRepositoryGateway usuarioRepository) {

    public interface UsuarioRepositoryGateway{
        Usuario buscarPorEmail(String email);
        Optional<Usuario> buscarPorGoogleId(String googleId);
        Usuario salvar(Usuario usuario);
    }

    public Optional<Usuario> buscarUsuarioCadastrado(String googleId, String email) {
        Optional<Usuario> porGoogleId = usuarioRepository.buscarPorGoogleId(googleId);
        if (porGoogleId.isPresent()) {
            return porGoogleId;
        }

        Usuario porEmail = usuarioRepository.buscarPorEmail(email);
        if (porEmail != null && googleId.equals(porEmail.googleId())) {
            return Optional.of(porEmail);
        }

        return Optional.empty();
    }

    public Usuario cadastrarPendente(Usuario usuarioGoogle) {
        Usuario existentePorGoogleId = usuarioRepository.buscarPorGoogleId(usuarioGoogle.googleId()).orElse(null);
        if (existentePorGoogleId != null) {
            return existentePorGoogleId;
        }

        Usuario existentePorEmail = usuarioRepository.buscarPorEmail(usuarioGoogle.email());
        if (existentePorEmail != null) {
            if (!usuarioGoogle.googleId().equals(existentePorEmail.googleId())) {
                throw new IllegalStateException("O e-mail já está associado a outro Google ID");
            }
            return existentePorEmail;
        }

        return usuarioRepository.salvar(new Usuario(
                usuarioGoogle.id(),
                usuarioGoogle.googleId(),
                usuarioGoogle.email(),
                usuarioGoogle.nome(),
                usuarioGoogle.fotoUrl(),
                false,
                usuarioGoogle.criadoEm(),
                usuarioGoogle.atualizadoEm(),
                usuarioGoogle.perfis()));
    }

    public Usuario executar(Usuario usuarioGoogle){
        Usuario existentePorGoogleId = usuarioRepository.buscarPorGoogleId(usuarioGoogle.googleId()).orElse(null);
        if (existentePorGoogleId != null) {
            return existentePorGoogleId;
        }

        Usuario existente = usuarioRepository.buscarPorEmail(usuarioGoogle.email());

        if (existente != null){
            throw new IllegalStateException("O e-mail já está associado a outro usuário Google");
        }

        return usuarioRepository.salvar(usuarioGoogle);
    }
}
