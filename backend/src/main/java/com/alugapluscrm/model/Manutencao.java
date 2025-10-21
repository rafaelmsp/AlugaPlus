package com.alugapluscrm.model;

import com.alugapluscrm.model.enums.ManutencaoStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "manutencoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imovel_id", nullable = false)
    private Imovel imovel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contrato_id")
    private Contrato contrato;

    @Column(nullable = false)
    private LocalDate dataSolicitacao;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String responsavel;

    private BigDecimal custo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ManutencaoStatus status;

    @ElementCollection
    @CollectionTable(name = "manutencao_fotos", joinColumns = @JoinColumn(name = "manutencao_id"))
    @Column(name = "foto")
    @Builder.Default
    private List<String> fotos = new ArrayList<>();
}
