package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Patrimonio;
import com.epatrimonio.api.repository.PatrimonioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatrimonioService {
    private final PatrimonioRepository repository;

    public Patrimonio salvar(Patrimonio patrimonio) {
        return repository.save(patrimonio);
    }

    public Patrimonio buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Patrimonio> listarTodos() {
        return repository.findAll();
    }

    public Patrimonio atualizar(Long id, Patrimonio dados) {
        Patrimonio patrimonio = repository.findById(id).orElse(null);
        if (patrimonio == null) {
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
