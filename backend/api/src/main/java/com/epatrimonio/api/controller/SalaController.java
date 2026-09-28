package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Sala;
import com.epatrimonio.api.service.SalaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/salas")
@RequiredArgsConstructor
public class SalaController {
    private final SalaService service;

    @GetMapping
    public ResponseEntity<List<Sala>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sala> buscarPorId(@PathVariable Long id) {
        Sala sala = service.buscarPorId(id);
        return sala == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(sala);
    }

    @PostMapping
    public ResponseEntity<Sala> salvar(@RequestBody Sala sala) {
        Sala salvo = service.salvar(sala);
        return ResponseEntity.created(URI.create("/api/salas/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sala> atualizar(@PathVariable Long id, @RequestBody Sala sala) {
        Sala atualizado = service.atualizar(id, sala);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
