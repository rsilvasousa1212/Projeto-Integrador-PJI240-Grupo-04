package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Responsavel;
import com.epatrimonio.api.service.ResponsavelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/responsaveis")
@RequiredArgsConstructor
public class ResponsavelController {
    private final ResponsavelService service;

    @GetMapping
    public ResponseEntity<List<Responsavel>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Responsavel> buscarPorId(@PathVariable Long id) {
        Responsavel responsavel = service.buscarPorId(id);
        return responsavel == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(responsavel);
    }

    @PostMapping
    public ResponseEntity<Responsavel> salvar(@RequestBody Responsavel responsavel) {
        Responsavel salvo = service.salvar(responsavel);
        return ResponseEntity.created(URI.create("/api/responsaveis/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Responsavel> atualizar(@PathVariable Long id, @RequestBody Responsavel responsavel) {
        Responsavel atualizado = service.atualizar(id, responsavel);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
