package com.alugapluscrm.model;

import com.alugapluscrm.model.enums.FormaPagamento;
import com.alugapluscrm.model.enums.MovimentacaoStatus;
import com.alugapluscrm.model.enums.MovimentacaoTipo;
import com.alugapluscrm.tenant.TenantContext;
import com.alugapluscrm.tenant.TenantEntityListener;
import com.alugapluscrm.tenant.TenantScoped;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "movimentacoes_financeiras")
@EntityListeners(TenantEntityListener.class)
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentacaoFinanceira implements TenantScoped {

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

    @Column(name = "tenant_id", nullable = false, length = 120)
    private String tenantId;

    @PrePersist
    public void prePersist() {
        if (tenantId == null || tenantId.isBlank()) {
            tenantId = TenantContext.getTenantId();
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (tenantId == null || tenantId.isBlank()) {
            tenantId = TenantContext.getTenantId();
        }
    }

    @Override
    public String getTenantId() {
        return tenantId;
    }

    @Override
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}
