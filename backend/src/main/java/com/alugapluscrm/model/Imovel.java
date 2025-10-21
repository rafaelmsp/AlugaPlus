package com.alugapluscrm.model;

import com.alugapluscrm.model.enums.ImovelStatus;
import com.alugapluscrm.model.enums.ImovelTipo;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "imoveis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Imovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String endereco;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ImovelTipo tipo;

    @Column(nullable = false)
    private BigDecimal valorAluguel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ImovelStatus status;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String fotoCapa;

    @Column(nullable = false)
    private LocalDate dataCadastro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "predio_id")
    private Predio predio;

    @OneToMany(mappedBy = "imovel", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Contrato> contratos = new ArrayList<>();

    @OneToMany(mappedBy = "imovel", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Vistoria> vistorias = new ArrayList<>();

    @OneToMany(mappedBy = "imovel", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MovimentacaoFinanceira> movimentacoes = new ArrayList<>();

    @OneToMany(mappedBy = "imovel", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Manutencao> manutencoes = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (dataCadastro == null) {
            dataCadastro = LocalDate.now();
        }
        if (status == null) {
            status = ImovelStatus.DISPONIVEL;
        }
    }
}
