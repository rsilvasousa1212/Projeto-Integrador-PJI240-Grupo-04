package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Permissao;
import com.epatrimonio.api.repository.PermissaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissaoService {
    private final PermissaoRepository repository;

    public Permissao salvar(Permissao permissao) {
        return repository.save(permissao);
    }

    public Permissao buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Permissao> listarTodos() {
        return repository.findAll();
    }

    public Permissao atualizar(Long id, Permissao dados) {
        Permissao permissao = repository.findById(id).orElse(null);
        if (permissao == null) {
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
