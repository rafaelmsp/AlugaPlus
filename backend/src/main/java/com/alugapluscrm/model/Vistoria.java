package com.alugapluscrm.model;

import com.alugapluscrm.model.enums.VistoriaTipo;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vistorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vistoria {

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
    private LocalDate dataVistoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VistoriaTipo tipo;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @ElementCollection
    @CollectionTable(name = "vistoria_fotos", joinColumns = @JoinColumn(name = "vistoria_id"))
    @Column(name = "foto")
    @Builder.Default
    private List<String> fotos = new ArrayList<>();

    private Integer avaliacao;
}
