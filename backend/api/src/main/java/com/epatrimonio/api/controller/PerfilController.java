package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Perfil;
import com.epatrimonio.api.service.PerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/perfis")
@RequiredArgsConstructor
public class PerfilController {
    private final PerfilService service;

    @GetMapping
    public ResponseEntity<List<Perfil>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perfil> buscarPorId(@PathVariable Long id) {
        Perfil perfil = service.buscarPorId(id);
        return perfil == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(perfil);
    }

    @PostMapping
    public ResponseEntity<Perfil> salvar(@RequestBody Perfil perfil) {
        Perfil salvo = service.salvar(perfil);
        return ResponseEntity.created(URI.create("/api/perfis/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Perfil> atualizar(@PathVariable Long id, @RequestBody Perfil perfil) {
        Perfil atualizado = service.atualizar(id, perfil);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
