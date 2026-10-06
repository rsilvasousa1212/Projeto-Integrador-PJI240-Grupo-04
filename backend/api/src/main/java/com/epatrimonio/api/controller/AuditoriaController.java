package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Auditoria;
import com.epatrimonio.api.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
@RequiredArgsConstructor
public class AuditoriaController {
    private final AuditoriaService service;

    @GetMapping
    public ResponseEntity<List<Auditoria>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auditoria> buscarPorId(@PathVariable Long id) {
        Auditoria auditoria = service.buscarPorId(id);
        return auditoria == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(auditoria);
    }

    @PostMapping
    public ResponseEntity<Auditoria> salvar(@RequestBody Auditoria auditoria) {
        Auditoria salvo = service.salvar(auditoria);
        return ResponseEntity.created(URI.create("/api/auditoria/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Auditoria> atualizar(@PathVariable Long id, @RequestBody Auditoria auditoria) {
        Auditoria atualizado = service.atualizar(id, auditoria);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
