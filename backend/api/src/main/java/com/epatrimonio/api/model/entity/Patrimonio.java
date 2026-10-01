package com.epatrimonio.api.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"categoria", "marca", "modelo", "situacao", "unidade", "andar", "sala", "setor", "responsavel"})
@Entity
@Table(name = "patrimonio")
public class Patrimonio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "tombamento", length = 50, nullable = false, unique = true)
    private String tombamento;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marca_id")
    private Marca marca;

    // No SQL 'modelo_id' é opcional (sem NOT NULL), por isso removemos 'optional = false'
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modelo_id")
    private Modelo modelo;

    @Column(name = "numero_serie", length = 150)
    private String numeroSerie;

    @Column(name = "descricao", length = 255)
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "situacao_id", nullable = false)
    private Situacao situacao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "unidade_id", nullable = false)
    private Unidade unidade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "andar_id")
    private Andar andar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_id")
    private Sala sala;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setor_id")
    private Setor setor;

    // Aponta para a nova classe Responsavel
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsavel_id")
    private Responsavel responsavel;

    @Column(name = "data_aquisicao")
    private LocalDate dataAquisicao;

    @Column(name = "valor_aquisicao", precision = 15, scale = 2)
    private BigDecimal valorAquisicao;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    @Builder.Default
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

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