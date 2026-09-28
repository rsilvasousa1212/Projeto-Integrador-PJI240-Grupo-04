package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Unidade;
import com.epatrimonio.api.repository.UnidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnidadeService {
    private final UnidadeRepository repository;

    public Unidade salvar(Unidade unidade) {
        return repository.save(unidade);
    }

    public Unidade buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Unidade> listarTodos() {
        return repository.findAll();
    }

    public Unidade atualizar(Long id, Unidade dados) {
        Unidade unidade = repository.findById(id).orElse(null);
        if (unidade == null) {
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
