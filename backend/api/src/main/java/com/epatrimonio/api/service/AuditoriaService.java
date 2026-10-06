package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Auditoria;
import com.epatrimonio.api.repository.AuditoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditoriaService {
    private final AuditoriaRepository repository;

    public Auditoria salvar(Auditoria auditoria) {
        return repository.save(auditoria);
    }

    public Auditoria buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Auditoria> listarTodos() {
        return repository.findAll();
    }

    public Auditoria atualizar(Long id, Auditoria dados) {
        Auditoria auditoria = repository.findById(id).orElse(null);
        if (auditoria == null) {
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
