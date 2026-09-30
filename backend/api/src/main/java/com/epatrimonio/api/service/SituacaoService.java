package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Situacao;
import com.epatrimonio.api.repository.SituacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SituacaoService {
    private final SituacaoRepository repository;

    public Situacao salvar(Situacao situacao) {
        return repository.save(situacao);
    }

    public Situacao buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Situacao> listarTodos() {
        return repository.findAll();
    }

    public Situacao atualizar(Long id, Situacao dados) {
        Situacao situacao = repository.findById(id).orElse(null);
        if (situacao == null) {
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
