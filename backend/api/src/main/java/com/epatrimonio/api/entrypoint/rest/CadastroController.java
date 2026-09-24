package com.epatrimonio.api.entrypoint.rest;

import com.epatrimonio.api.core.usecase.cadastro.CadastroQueryService;
import com.epatrimonio.api.entrypoint.rest.dto.PerfilResponseDTO;
import com.epatrimonio.api.entrypoint.rest.dto.PermissaoResponseDTO;
import com.epatrimonio.api.entrypoint.rest.dto.SituacaoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CadastroController {
    private final CadastroQueryService cadastroQueryService;

    public CadastroController(CadastroQueryService cadastroQueryService) {
        this.cadastroQueryService = cadastroQueryService;
    }

    @GetMapping("/perfis")
    @Operation(summary = "Lista todos os perfis")
    public List<PerfilResponseDTO> listarPerfis() {
        return cadastroQueryService.listarPerfis();
    }

    @GetMapping("/permissoes")
    @Operation(summary = "Lista todas as permissoes")
    public List<PermissaoResponseDTO> listarPermissoes() {
        return cadastroQueryService.listarPermissoes();
    }

    @GetMapping("/situacoes")
    @Operation(summary = "Lista todas as situacoes")
    public List<SituacaoResponseDTO> listarSituacoes() {
        return cadastroQueryService.listarSituacoes();
    }
}