package com.epatrimonio.api.entrypoint.rest;

import com.epatrimonio.api.dataprovider.database.implementation.UsuarioRepositoryAdapter;
import com.epatrimonio.api.entrypoint.rest.dto.UsuarioResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    private final UsuarioRepositoryAdapter usuarioRepositoryAdapter;

    public UsuarioController(UsuarioRepositoryAdapter usuarioRepositoryAdapter) {
        this.usuarioRepositoryAdapter = usuarioRepositoryAdapter;
    }

    @GetMapping("/usuarios")
    @Operation(summary = "Lista todos os usuários")
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepositoryAdapter.buscarTodos().stream()
                .map(UsuarioResponseDTO::from)
                .toList();
    }

    @GetMapping("/usuarios/{id}")
    @Operation(summary = "Busca um usuário por id")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        return usuarioRepositoryAdapter.buscarPorId(id)
                .map(UsuarioResponseDTO::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}