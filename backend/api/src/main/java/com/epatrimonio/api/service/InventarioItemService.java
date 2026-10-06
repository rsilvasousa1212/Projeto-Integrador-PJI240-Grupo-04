package com.epatrimonio.api.service;

import com.epatrimonio.api.model.entity.InventarioItem;
import com.epatrimonio.api.repository.InventarioItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventarioItemService {
    private final InventarioItemRepository repository;

    public InventarioItem salvar(InventarioItem inventarioItem) {
        return repository.save(inventarioItem);
    }

    public InventarioItem buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<InventarioItem> listarTodos() {
        return repository.findAll();
    }

    public InventarioItem atualizar(Long id, InventarioItem dados) {
        InventarioItem inventarioItem = repository.findById(id).orElse(null);
        if (inventarioItem == null) {
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
