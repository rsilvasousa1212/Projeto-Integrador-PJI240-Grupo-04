package com.epatrimonio.api.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "andar")
public class Andar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "descricao", length = 255)
    private String descricao;

    @ManyToOne(optional = false)
    @JoinColumn(name = "unidade_id", nullable = false)
    private Unidade unidade;

    @Builder.Default
    @OneToMany(mappedBy = "andar", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Sala> salas = new HashSet<>();

    
}