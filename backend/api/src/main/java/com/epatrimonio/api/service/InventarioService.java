package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.Inventario;
import com.epatrimonio.api.repository.InventarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventarioService {
    private final InventarioRepository repository;

    public Inventario salvar(Inventario inventario) {
        return repository.save(inventario);
    }

    public Inventario buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Inventario> listarTodos() {
        return repository.findAll();
    }

    public Inventario atualizar(Long id, Inventario dados) {
        Inventario inventario = repository.findById(id).orElse(null);
        if (inventario == null) {
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
