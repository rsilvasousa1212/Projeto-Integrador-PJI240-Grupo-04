package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Setor;
import com.epatrimonio.api.repository.SetorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SetorService {
    private final SetorRepository repository;

    public Setor salvar(Setor setor) {
        return repository.save(setor);
    }

    public Setor buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Setor> listarTodos() {
        return repository.findAll();
    }

    public Setor atualizar(Long id, Setor dados) {
        Setor setor = repository.findById(id).orElse(null);
        if (setor == null) {
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
