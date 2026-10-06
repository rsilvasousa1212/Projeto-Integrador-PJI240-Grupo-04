package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Movimentacao;
import com.epatrimonio.api.service.MovimentacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/movimentacoes")
@RequiredArgsConstructor
public class MovimentacaoController {
    private final MovimentacaoService service;

    @GetMapping
    public ResponseEntity<List<Movimentacao>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movimentacao> buscarPorId(@PathVariable Long id) {
        Movimentacao movimentacao = service.buscarPorId(id);
        return movimentacao == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(movimentacao);
    }

    @PostMapping
    public ResponseEntity<Movimentacao> salvar(@RequestBody Movimentacao movimentacao) {
        Movimentacao salvo = service.salvar(movimentacao);
        return ResponseEntity.created(URI.create("/api/movimentacoes/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movimentacao> atualizar(@PathVariable Long id, @RequestBody Movimentacao movimentacao) {
        Movimentacao atualizado = service.atualizar(id, movimentacao);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
