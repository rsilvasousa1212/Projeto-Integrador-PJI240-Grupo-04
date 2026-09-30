package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Marca;
import com.epatrimonio.api.service.MarcaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/marcas")
@RequiredArgsConstructor
public class MarcaController {
    private final MarcaService service;

    @GetMapping
    public ResponseEntity<List<Marca>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marca> buscarPorId(@PathVariable Long id) {
        Marca marca = service.buscarPorId(id);
        return marca == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(marca);
    }

    @PostMapping
    public ResponseEntity<Marca> salvar(@RequestBody Marca marca) {
        Marca salvo = service.salvar(marca);
        return ResponseEntity.created(URI.create("/api/marcas/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marca> atualizar(@PathVariable Long id, @RequestBody Marca marca) {
        Marca atualizado = service.atualizar(id, marca);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
