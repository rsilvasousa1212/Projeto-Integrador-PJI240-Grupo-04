package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Usuario;
import com.epatrimonio.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository repository;

    public Usuario salvar(Usuario usuario) {
        return repository.save(usuario);
    }

    public Usuario buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public Usuario atualizar(Long id, Usuario dados) {
        if (!repository.existsById(id)) {
            return null;
        }
        dados.setId(id);
        return repository.save(dados);
    }

    public boolean deletar(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
