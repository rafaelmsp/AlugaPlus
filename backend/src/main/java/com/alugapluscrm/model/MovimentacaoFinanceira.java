package com.alugapluscrm.model;

import com.alugapluscrm.model.enums.FormaPagamento;
import com.alugapluscrm.model.enums.MovimentacaoStatus;
import com.alugapluscrm.model.enums.MovimentacaoTipo;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "movimentacoes_financeiras")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentacaoFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovimentacaoTipo tipo;

    @Column(nullable = false)
    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imovel_id")
    private Imovel imovel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contrato_id")
    private Contrato contrato;

    private String comprovante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovimentacaoStatus status;

    @Enumerated(EnumType.STRING)
    private FormaPagamento formaPagamento;

    private String referencia;
}
