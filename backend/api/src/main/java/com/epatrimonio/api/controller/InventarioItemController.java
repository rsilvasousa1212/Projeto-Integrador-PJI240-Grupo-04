package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.InventarioItem;
import com.epatrimonio.api.service.InventarioItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/inventario-item")
@RequiredArgsConstructor
public class InventarioItemController {
    private final InventarioItemService service;

    @GetMapping
    public ResponseEntity<List<InventarioItem>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioItem> buscarPorId(@PathVariable Long id) {
        InventarioItem inventarioItem = service.buscarPorId(id);
        return inventarioItem == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(inventarioItem);
    }

    @PostMapping
    public ResponseEntity<InventarioItem> salvar(@RequestBody InventarioItem inventarioItem) {
        InventarioItem salvo = service.salvar(inventarioItem);
        return ResponseEntity.created(URI.create("/api/inventario-item/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventarioItem> atualizar(@PathVariable Long id, @RequestBody InventarioItem inventarioItem) {
        InventarioItem atualizado = service.atualizar(id, inventarioItem);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
