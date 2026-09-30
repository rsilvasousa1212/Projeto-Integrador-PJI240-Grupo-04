package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Categoria;
import com.epatrimonio.api.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {
    private final CategoriaRepository repository;

    public Categoria salvar(Categoria categoria) {
        return repository.save(categoria);
    }

    public Categoria buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Categoria> listarTodos() {
        return repository.findAll();
    }

    public Categoria atualizar(Long id, Categoria dados) {
        Categoria categoria = repository.findById(id).orElse(null);
        if (categoria == null) {
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
