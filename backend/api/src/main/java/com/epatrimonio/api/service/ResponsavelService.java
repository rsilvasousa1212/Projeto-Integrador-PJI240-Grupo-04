package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Responsavel;
import com.epatrimonio.api.repository.ResponsavelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResponsavelService {
    private final ResponsavelRepository repository;

    public Responsavel salvar(Responsavel responsavel) {
        return repository.save(responsavel);
    }

    public Responsavel buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Responsavel> listarTodos() {
        return repository.findAll();
    }

    public Responsavel atualizar(Long id, Responsavel dados) {
        Responsavel responsavel = repository.findById(id).orElse(null);
        if (responsavel == null) {
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
