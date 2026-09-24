package com.epatrimonio.api.core.usecase.cadastro;

import com.epatrimonio.api.dataprovider.database.repository.SpringPerfilRepository;
import com.epatrimonio.api.dataprovider.database.repository.SpringPermissaoRepository;
import com.epatrimonio.api.dataprovider.database.repository.SpringSituacaoRepository;
import com.epatrimonio.api.entrypoint.rest.dto.PerfilResponseDTO;
import com.epatrimonio.api.entrypoint.rest.dto.PermissaoResponseDTO;
import com.epatrimonio.api.entrypoint.rest.dto.SituacaoResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CadastroQueryService {
    private final SpringPerfilRepository perfilRepository;
    private final SpringPermissaoRepository permissaoRepository;
    private final SpringSituacaoRepository situacaoRepository;

    public CadastroQueryService(SpringPerfilRepository perfilRepository,
                                SpringPermissaoRepository permissaoRepository,
                                SpringSituacaoRepository situacaoRepository) {
        this.perfilRepository = perfilRepository;
        this.permissaoRepository = permissaoRepository;
        this.situacaoRepository = situacaoRepository;
    }

    public List<PerfilResponseDTO> listarPerfis() {
        return perfilRepository.findAll().stream().map(PerfilResponseDTO::from).toList();
    }

    public List<PermissaoResponseDTO> listarPermissoes() {
        return permissaoRepository.findAll().stream().map(PermissaoResponseDTO::from).toList();
    }

    public List<SituacaoResponseDTO> listarSituacoes() {
        return situacaoRepository.findAll().stream().map(SituacaoResponseDTO::from).toList();
    }
}