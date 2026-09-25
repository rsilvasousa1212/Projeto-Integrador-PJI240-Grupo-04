package com.epatrimonio.api.dataprovider.database.implementation;

import com.epatrimonio.api.core.domain.Usuario;
import com.epatrimonio.api.core.mapper.UsuarioMapper;
import com.epatrimonio.api.core.usecase.usuario.SincronizarUsuarioGoogleUseCase;
import com.epatrimonio.api.dataprovider.database.repository.SpringUsuarioRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public record UsuarioRepositoryAdapter(SpringUsuarioRepository springUsuarioRepository, UsuarioMapper usuarioMapper)
        implements SincronizarUsuarioGoogleUseCase.UsuarioRepositoryGateway {

    @Override
    public Usuario buscarPorEmail(String email) {
        return springUsuarioRepository.findByEmail(email)
                .map(usuarioMapper::toDomain)
                .orElse(null);
    }

    @Override
    public Optional<Usuario> buscarPorGoogleId(String googleId) {
        return springUsuarioRepository.findByGoogleId(googleId)
                .map(usuarioMapper::toDomain)
                ;
    }

    @Override
    public Usuario salvar(Usuario usuario) {
        var entity = usuarioMapper.toEntity(usuario);
        return usuarioMapper.toDomain(springUsuarioRepository.save(entity));
    }

    public List<Usuario> buscarTodos() {
        return springUsuarioRepository.findAll().stream()
                .map(usuarioMapper::toDomain)
                .toList();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return springUsuarioRepository.findById(id)
                .map(usuarioMapper::toDomain);
    }
}