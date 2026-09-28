package com.epatrimonio.api.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "unidade")
public class Unidade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo", unique = true, nullable = false, length = 30)
    private String codigo;

    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @Column(name = "descricao", length = 255)
    private String descricao;
    
    @Column(name = "endereco", length = 255)
    private String endereco;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;
    
    @Column(name = "criado_em", updatable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "atualizado_em")
    private OffsetDateTime atualizadoEm;

    // Relacionamento com Andar (1 para N)
    @Builder.Default
    @OneToMany(mappedBy = "unidade", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Andar> andares = new HashSet<>();

    // Relacionamento com Setor (1 para N)
    @Builder.Default
    @OneToMany(mappedBy = "unidade", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Setor> setores = new HashSet<>();

    // Relacionamento com Usuario (N para N através de usuario_unidade)
    @Builder.Default
    @ManyToMany(mappedBy = "unidades") // Assumindo que o lado dono esteja em Usuario, ou vice-versa
    private Set<Usuario> usuarios = new HashSet<>();

}