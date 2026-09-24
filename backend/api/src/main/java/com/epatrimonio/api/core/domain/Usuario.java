package com.epatrimonio.api.core.domain;

import java.time.OffsetDateTime;
import java.util.List;

public record Usuario(
    Long id,
    String googleId,
    String email,
    String nome,
    String fotoUrl,
    Boolean ativo,
    OffsetDateTime criadoEm,
    OffsetDateTime atualizadoEm,
    List<Perfil> perfis
) {
}
