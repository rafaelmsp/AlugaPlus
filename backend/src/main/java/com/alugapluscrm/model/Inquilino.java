package com.alugapluscrm.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inquilinos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquilino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    private String telefone;

    @Column(nullable = false)
    private String email;

    private String endereco;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "inquilino", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Contrato> contratos = new ArrayList<>();
}
