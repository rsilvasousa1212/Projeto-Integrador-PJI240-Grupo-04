package com.epatrimonio.api.core.mapper;

import com.epatrimonio.api.core.domain.Usuario;
import com.epatrimonio.api.dataprovider.database.entity.UsuarioEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(target = "perfis", ignore = true)
    Usuario toDomain(UsuarioEntity entity);

    @Mapping(target = "perfis", ignore = true)
    default UsuarioEntity toEntity(Usuario domain) {
        if (domain == null) {
            return null;
        }

        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(domain.id());
        entity.setGoogleId(domain.googleId());
        entity.setEmail(domain.email());
        entity.setNome(domain.nome());
        entity.setFotoUrl(domain.fotoUrl());
        entity.setAtivo(domain.ativo() != null ? domain.ativo() : true);
        entity.setCriadoEm(domain.criadoEm());
        entity.setAtualizadoEm(domain.atualizadoEm());
        return entity;
    }
}
