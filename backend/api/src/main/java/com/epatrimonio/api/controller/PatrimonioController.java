package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Patrimonio;
import com.epatrimonio.api.service.PatrimonioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/patrimonios")
@RequiredArgsConstructor
public class PatrimonioController {
    private final PatrimonioService service;

    @GetMapping
    public ResponseEntity<List<Patrimonio>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patrimonio> buscarPorId(@PathVariable Long id) {
        Patrimonio patrimonio = service.buscarPorId(id);
        return patrimonio == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(patrimonio);
    }

    @PostMapping
    public ResponseEntity<Patrimonio> salvar(@RequestBody Patrimonio patrimonio) {
        Patrimonio salvo = service.salvar(patrimonio);
        return ResponseEntity.created(URI.create("/api/patrimonios/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patrimonio> atualizar(@PathVariable Long id, @RequestBody Patrimonio patrimonio) {
        Patrimonio atualizado = service.atualizar(id, patrimonio);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
