package com.epatrimonio.api.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name= "categoria")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 100, unique = true)
    private String nome;

    @Column(name = "descricao", nullable = false, length = 255)
    private String descricao;

    @Builder.Default
    @Column(name = "ativo",nullable = false)
    private Boolean ativo = true;

}
