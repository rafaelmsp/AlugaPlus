package com.alugapluscrm.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "predios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Predio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    private Integer numeroUnidades;

    private String sindico;
    private String contato;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @OneToMany(mappedBy = "predio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Imovel> imoveis = new ArrayList<>();

    @OneToMany(mappedBy = "predio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ContaPredio> contas = new ArrayList<>();
}
