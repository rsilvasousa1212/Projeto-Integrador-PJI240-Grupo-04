package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Inventario;
import com.epatrimonio.api.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/inventarios")
@RequiredArgsConstructor
public class InventarioController {
    private final InventarioService service;

    @GetMapping
    public ResponseEntity<List<Inventario>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventario> buscarPorId(@PathVariable Long id) {
        Inventario inventario = service.buscarPorId(id);
        return inventario == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(inventario);
    }

    @PostMapping
    public ResponseEntity<Inventario> salvar(@RequestBody Inventario inventario) {
        Inventario salvo = service.salvar(inventario);
        return ResponseEntity.created(URI.create("/api/inventarios/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventario> atualizar(@PathVariable Long id, @RequestBody Inventario inventario) {
        Inventario atualizado = service.atualizar(id, inventario);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
