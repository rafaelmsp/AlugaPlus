package com.alugapluscrm.model;

import com.alugapluscrm.model.enums.ContaPredioStatus;
import com.alugapluscrm.model.enums.ContaPredioTipo;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contas_predio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContaPredio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "predio_id", nullable = false)
    private Predio predio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContaPredioTipo tipo;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(nullable = false)
    private Integer mesReferencia;

    @Column(nullable = false)
    private Integer anoReferencia;

    @Column(nullable = false)
    private LocalDate vencimento;

    private LocalDate dataPagamento;

    private String comprovante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContaPredioStatus status;

    private boolean recorrente;

    @Column(columnDefinition = "TEXT")
    private String observacao;
}
