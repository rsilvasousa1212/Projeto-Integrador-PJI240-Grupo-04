package com.epatrimonio.api.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"inventario", "patrimonio", "usuarioConferencia"})
@Entity
@Table(
        name = "inventario_item",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_inventario_patrimonio", columnNames = {"inventario_id", "patrimonio_id"})
        }
)
public class InventarioItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inventario_id", nullable = false)
    private Inventario inventario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patrimonio_id", nullable = false)
    private Patrimonio patrimonio;

    @Builder.Default
    @Column(name = "encontrado", nullable = false)
    private Boolean encontrado = false;

    @Column(name = "data_conferencia")
    private OffsetDateTime dataConferencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_conferencia")
    private Usuario usuarioConferencia;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;
}