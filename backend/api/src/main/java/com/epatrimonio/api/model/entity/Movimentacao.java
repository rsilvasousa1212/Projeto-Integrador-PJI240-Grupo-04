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
@ToString(exclude = {"patrimonio", "unidadeOrigem", "andarOrigem", "salaOrigem", "setorOrigem", "unidadeDestino", "andarDestino", "salaDestino", "setorDestino", "responsavelAnterior", "responsavelNovo", "usuario"})
@Entity
@Table(name = "movimentacao")
public class Movimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patrimonio_id", nullable = false)
    private Patrimonio patrimonio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unidade_origem_id")
    private Unidade unidadeOrigem;

    // No SQL 'modelo_id' é opcional (sem NOT NULL), por isso removemos 'optional = false'
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "andar_origem_id")
    private Modelo andarOrigem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_origem_id")
    private Sala salaOrigem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setor_origem_id")
    private Setor setorOrigem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "unidade_destino_id", nullable = false)
    private Unidade unidadeDestino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "andar_destino_id")
    private Modelo andarDestino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_destino_id")
    private Sala salaDestino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setor_destino_id")
    private Setor setorDestino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsavel_anterior_id")
    private Responsavel responsavelAnterior;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsavel_nono_id")
    private Responsavel responsavelNovo;

    @Builder.Default
    @Column(name = "data_movimentacao", nullable = false)
    private OffsetDateTime dataMovimentacao = OffsetDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "motivo", length = 255)
    private String motivo;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    @PrePersist
    protected void onCreate() {
        if (this.dataMovimentacao == null) {
            this.dataMovimentacao = OffsetDateTime.now();
        }
    }

}