package com.alugapluscrm.model;

import com.alugapluscrm.model.enums.ContratoStatus;
import com.alugapluscrm.tenant.TenantConstants;
import com.alugapluscrm.tenant.TenantEntityListener;
import com.alugapluscrm.tenant.TenantScoped;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contratos")
@EntityListeners(TenantEntityListener.class)
@FilterDef(
        name = TenantConstants.FILTER_NAME,
        parameters = @ParamDef(name = TenantConstants.FILTER_PARAM, type = String.class)
)
@Filter(name = TenantConstants.FILTER_NAME, condition = "tenant_id = :tenantId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrato implements TenantScoped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imovel_id", nullable = false)
    private Imovel imovel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inquilino_id", nullable = false)
    private Inquilino inquilino;

    @Column(nullable = false)
    private LocalDate dataInicio;

    private LocalDate dataFim;

    @Column(nullable = false)
    private BigDecimal valorMensal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContratoStatus status;

    private String arquivoPdf;

    private String hashDocumento;

    private LocalDateTime dataUpload;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @OneToMany(mappedBy = "contrato", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Pagamento> pagamentos = new ArrayList<>();

    @OneToMany(mappedBy = "contrato", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Vistoria> vistorias = new ArrayList<>();

    @OneToMany(mappedBy = "contrato", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MovimentacaoFinanceira> movimentacoes = new ArrayList<>();

    @OneToMany(mappedBy = "contrato", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Manutencao> manutencoes = new ArrayList<>();

    @Column(name = "tenant_id", nullable = false, updatable = false, length = 120)
    private String tenantId;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = ContratoStatus.PENDENTE;
        }
    }
}
