package com.alugapluscrm.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "planos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorMensal;

    private Integer qtdeUsuarios;
    private Integer qtdeImoveis;
    private Integer qtdeContratos;

    @Column(length = 1000)
    private String recursosExtras;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = Boolean.TRUE;
}
