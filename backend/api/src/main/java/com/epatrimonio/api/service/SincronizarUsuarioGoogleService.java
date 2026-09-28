package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Usuario;
import com.epatrimonio.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Centraliza as regras para localizar e cadastrar usuarios vindos do Google.
 * O servico depende de uma porta simples, e nao de uma implementacao JPA.
 */
@Service
public record SincronizarUsuarioGoogleService(UsuarioRepository usuarioRepository) {

    public Optional<Usuario> buscarUsuarioCadastrado(String googleId, String email) {
        Optional<Usuario> porGoogleId = usuarioRepository.findAll().stream()
            .filter(usuario -> googleId.equals(usuario.getGoogleId()))
            .findFirst();
        if (porGoogleId.isPresent()) {
            return porGoogleId;
        }

        Usuario porEmail = usuarioRepository.findAll().stream()
            .filter(usuario -> email.equals(usuario.getEmail()))
            .findFirst()
            .orElse(null);
        if (porEmail != null && googleId.equals(porEmail.getGoogleId())) {
            return Optional.of(porEmail);
        }

        return Optional.empty();
    }

    public Usuario cadastrarPendente(Usuario usuarioGoogle) {
        Usuario existentePorGoogleId = usuarioRepository.findAll().stream()
            .filter(usuario -> usuarioGoogle.getGoogleId().equals(usuario.getGoogleId()))
            .findFirst()
            .orElse(null);
        if (existentePorGoogleId != null) {
            return existentePorGoogleId;
        }

        Usuario existentePorEmail = usuarioRepository.findAll().stream()
            .filter(usuario -> usuarioGoogle.getEmail().equals(usuario.getEmail()))
            .findFirst()
            .orElse(null);
        if (existentePorEmail != null) {
            if (!usuarioGoogle.getGoogleId().equals(existentePorEmail.getGoogleId())) {
                throw new IllegalStateException("O e-mail já está associado a outro Google ID");
            }
            return existentePorEmail;
        }

        usuarioGoogle.setAtivo(false);
        return usuarioRepository.save(usuarioGoogle);
    }

    public Usuario executar(Usuario usuarioGoogle) {
        Usuario existentePorGoogleId = usuarioRepository.findAll().stream()
            .filter(usuario -> usuarioGoogle.getGoogleId().equals(usuario.getGoogleId()))
            .findFirst()
            .orElse(null);
        if (existentePorGoogleId != null) {
            return existentePorGoogleId;
        }

        Usuario existente = usuarioRepository.findAll().stream()
            .filter(usuario -> usuarioGoogle.getEmail().equals(usuario.getEmail()))
            .findFirst()
            .orElse(null);
        if (existente != null) {
            throw new IllegalStateException("O e-mail já está associado a outro usuário Google");
        }

        return usuarioRepository.save(usuarioGoogle);
    }
}
