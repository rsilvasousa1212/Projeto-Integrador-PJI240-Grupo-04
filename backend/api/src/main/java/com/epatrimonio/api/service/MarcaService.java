package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Marca;
import com.epatrimonio.api.repository.MarcaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarcaService {
    private final MarcaRepository repository;

    public Marca salvar(Marca marca) {
        return repository.save(marca);
    }

    public Marca buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Marca> listarTodos() {
        return repository.findAll();
    }

    public Marca atualizar(Long id, Marca dados) {
        Marca marca = repository.findById(id).orElse(null);
        if (marca == null) {
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
