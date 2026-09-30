package com.epatrimonio.api.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "marca")
public class Marca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", length = 150,  nullable = false, unique = true)
    private String nome;

    @Builder.Default
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

}
