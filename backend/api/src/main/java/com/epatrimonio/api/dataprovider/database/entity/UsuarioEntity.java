package com.epatrimonio.api.dataprovider.database.entity;

import com.epatrimonio.api.core.domain.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuario")
public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "google_id", nullable = false, unique = true, length = 100)
    private String googleId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "criado_em", updatable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "atualizado_em")
    private OffsetDateTime atualizadoEm;

        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(name = "usuario_perfil",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "perfil_id"))
        private Set<PerfilEntity> perfis = new HashSet<>();

    public Usuario toDomain() {
        var perfisDomain = perfis.stream()
            .map(perfil -> new com.epatrimonio.api.core.domain.Perfil(
                perfil.getId(),
                perfil.getNome(),
                perfil.getDescricao(),
                perfil.getAtivo(),
                perfil.getPermissoes().stream().map(PermissaoEntity::getCodigo).toList()))
            .toList();
        return new Usuario(id, googleId, email, nome, fotoUrl, ativo, criadoEm, atualizadoEm, perfisDomain);
    }

    public static UsuarioEntity fromDomain(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(usuario.id());
        entity.setGoogleId(usuario.googleId());
        entity.setEmail(usuario.email());
        entity.setNome(usuario.nome());
        entity.setFotoUrl(usuario.fotoUrl());
        entity.setAtivo(usuario.ativo() != null ? usuario.ativo() : true);
        entity.setCriadoEm(usuario.criadoEm());
        entity.setAtualizadoEm(usuario.atualizadoEm());
        return entity;
    }
}
