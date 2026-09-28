package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Setor;
import com.epatrimonio.api.service.SetorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/setores")
@RequiredArgsConstructor
public class SetorController {
    private final SetorService service;

    @GetMapping
    public ResponseEntity<List<Setor>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Setor> buscarPorId(@PathVariable Long id) {
        Setor setor = service.buscarPorId(id);
        return setor == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(setor);
    }

    @PostMapping
    public ResponseEntity<Setor> salvar(@RequestBody Setor setor) {
        Setor salvo = service.salvar(setor);
        return ResponseEntity.created(URI.create("/api/setores/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Setor> atualizar(@PathVariable Long id, @RequestBody Setor setor) {
        Setor atualizado = service.atualizar(id, setor);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
