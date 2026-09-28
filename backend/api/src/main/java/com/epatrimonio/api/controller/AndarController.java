package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Andar;
import com.epatrimonio.api.service.AndarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/andares")
@RequiredArgsConstructor
public class AndarController {
    private final AndarService service;

    @GetMapping
    public ResponseEntity<List<Andar>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Andar> buscarPorId(@PathVariable Long id) {
        Andar andar = service.buscarPorId(id);
        return andar == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(andar);
    }

    @PostMapping
    public ResponseEntity<Andar> salvar(@RequestBody Andar andar) {
        Andar salvo = service.salvar(andar);
        return ResponseEntity.created(URI.create("/api/andares/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Andar> atualizar(@PathVariable Long id, @RequestBody Andar andar) {
        Andar atualizado = service.atualizar(id, andar);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
