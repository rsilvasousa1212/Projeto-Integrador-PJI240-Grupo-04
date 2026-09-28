package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.entity.Permissao;
import com.epatrimonio.api.service.PermissaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/permissao")
@RequiredArgsConstructor
public class PermissaoController {
    private final PermissaoService service;

    @GetMapping
    public ResponseEntity<List<Permissao>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Permissao> buscarPorId(@PathVariable Long id) {
        Permissao permissao = service.buscarPorId(id);
        return permissao == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(permissao);
    }

    @PostMapping
    public ResponseEntity<Permissao> salvar(@RequestBody Permissao permissao) {
        Permissao salvo = service.salvar(permissao);
        return ResponseEntity.created(URI.create("/api/permissao/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Permissao> atualizar(@PathVariable Long id, @RequestBody Permissao permissao) {
        Permissao atualizado = service.atualizar(id, permissao);
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
