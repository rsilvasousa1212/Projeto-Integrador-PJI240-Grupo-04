package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Andar;
import com.epatrimonio.api.repository.AndarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AndarService {
    private final AndarRepository repository;

    public Andar salvar(Andar andar) {
        return repository.save(andar);
    }

    public Andar buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Andar> listarTodos() {
        return repository.findAll();
    }

    public Andar atualizar(Long id, Andar dados) {
        Andar andar = repository.findById(id).orElse(null);
        if (andar == null) {
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
