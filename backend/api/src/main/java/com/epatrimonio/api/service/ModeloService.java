package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Modelo;
import com.epatrimonio.api.repository.ModeloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModeloService {
    private final ModeloRepository repository;

    public Modelo salvar(Modelo modelo) {
        return repository.save(modelo);
    }

    public Modelo buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Modelo> listarTodos() {
        return repository.findAll();
    }

    public Modelo atualizar(Long id, Modelo dados) {
        Modelo modelo = repository.findById(id).orElse(null);
        if (modelo == null) {
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
