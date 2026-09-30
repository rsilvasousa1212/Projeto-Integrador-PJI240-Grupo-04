package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Modelo;
import com.epatrimonio.api.service.ModeloService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/modelos")
@RequiredArgsConstructor
public class ModeloController {
    private final ModeloService service;

    @GetMapping
    public ResponseEntity<List<Modelo>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Modelo> buscarPorId(@PathVariable Long id) {
        Modelo modelo = service.buscarPorId(id);
        return modelo == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(modelo);
    }

    @PostMapping
    public ResponseEntity<Modelo> salvar(@RequestBody Modelo modelo) {
        Modelo salvo = service.salvar(modelo);
        return ResponseEntity.created(URI.create("/api/modelos/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Modelo> atualizar(@PathVariable Long id, @RequestBody Modelo modelo) {
        Modelo atualizado = service.atualizar(id, modelo);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
