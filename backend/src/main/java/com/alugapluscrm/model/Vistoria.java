package com.alugapluscrm.model;

import com.alugapluscrm.model.enums.VistoriaTipo;
import com.alugapluscrm.tenant.TenantContext;
import com.alugapluscrm.tenant.TenantEntityListener;
import com.alugapluscrm.tenant.TenantScoped;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vistorias")
@EntityListeners(TenantEntityListener.class)
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vistoria implements TenantScoped {

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
