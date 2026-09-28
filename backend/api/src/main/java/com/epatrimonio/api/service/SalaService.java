package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Sala;
import com.epatrimonio.api.repository.SalaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaService {
    private final SalaRepository repository;

    public Sala salvar(Sala sala) {
        return repository.save(sala);
    }

    public Sala buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Sala> listarTodos() {
        return repository.findAll();
    }

    public Sala atualizar(Long id, Sala dados) {
        Sala sala = repository.findById(id).orElse(null);
        if (sala == null) {
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
