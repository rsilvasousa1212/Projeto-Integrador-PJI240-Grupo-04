package com.epatrimonio.api.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "responsavel")
public class Responsavel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @Column(name = "cpf", length = 11, unique = true)
    private String cpf;

    @Column(name = "matricula", length = 10, unique = true)
    private String matricula;

    @Builder.Default
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    // Relacionamento 1:1 com Usuario (Opcional se o usuário puder ser cadastrado depois)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", unique = true)
    private Usuario usuario;

    // Relacionamento N:1 com Unidade
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unidade_id", nullable = false)
    private Unidade unidade;

    // Relacionamento N:1 com Setor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setor_id", nullable = false)
    private Setor setor;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private OffsetDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        this.criadoEm = OffsetDateTime.now();
        this.atualizadoEm = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = OffsetDateTime.now();
    }
}