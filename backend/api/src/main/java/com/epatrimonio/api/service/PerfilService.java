package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Perfil;
import com.epatrimonio.api.repository.PerfilRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerfilService {
    private final PerfilRepository repository;

    public Perfil salvar(Perfil perfil) {
        return repository.save(perfil);
    }

    public Perfil buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Perfil> listarTodos() {
        return repository.findAll();
    }

    public Perfil atualizar(Long id, Perfil dados) {
        Perfil perfil = repository.findById(id).orElse(null);
        if (perfil == null) {
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
