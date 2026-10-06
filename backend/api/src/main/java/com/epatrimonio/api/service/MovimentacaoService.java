package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Movimentacao;
import com.epatrimonio.api.repository.MovimentacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimentacaoService {
    private final MovimentacaoRepository repository;

    public Movimentacao salvar(Movimentacao movimentacao) {
        return repository.save(movimentacao);
    }

    public Movimentacao buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Movimentacao> listarTodos() {
        return repository.findAll();
    }

    public Movimentacao atualizar(Long id, Movimentacao dados) {
        Movimentacao movimentacao = repository.findById(id).orElse(null);
        if (movimentacao == null) {
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
