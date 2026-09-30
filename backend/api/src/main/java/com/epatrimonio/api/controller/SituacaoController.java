package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Situacao;
import com.epatrimonio.api.service.SituacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/situacoes")
@RequiredArgsConstructor
public class SituacaoController {
    private final SituacaoService service;

    @GetMapping
    public ResponseEntity<List<Situacao>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Situacao> buscarPorId(@PathVariable Long id) {
        Situacao situacao = service.buscarPorId(id);
        return situacao == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(situacao);
    }

    @PostMapping
    public ResponseEntity<Situacao> salvar(@RequestBody Situacao situacao) {
        Situacao salvo = service.salvar(situacao);
        return ResponseEntity.created(URI.create("/api/situacoes/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Situacao> atualizar(@PathVariable Long id, @RequestBody Situacao situacao) {
        Situacao atualizado = service.atualizar(id, situacao);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
