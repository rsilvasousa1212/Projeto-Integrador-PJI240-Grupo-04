package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Unidade;
import com.epatrimonio.api.service.UnidadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/unidades")
@RequiredArgsConstructor
public class UnidadeController {
    private final UnidadeService service;

    @GetMapping
    public ResponseEntity<List<Unidade>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Unidade> buscarPorId(@PathVariable Long id) {
        Unidade unidade = service.buscarPorId(id);
        return unidade == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(unidade);
    }

    @PostMapping
    public ResponseEntity<Unidade> salvar(@RequestBody Unidade unidade) {
        Unidade salvo = service.salvar(unidade);
        return ResponseEntity.created(URI.create("/api/unidades/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Unidade> atualizar(@PathVariable Long id, @RequestBody Unidade unidade) {
        Unidade atualizado = service.atualizar(id, unidade);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
