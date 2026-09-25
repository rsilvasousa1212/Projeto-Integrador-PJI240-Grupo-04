package com.epatrimonio.api.core.domain;

import java.util.List;

public record Perfil(Long id, String nome, String descricao, Boolean ativo, List<String> permissoes) {
}
