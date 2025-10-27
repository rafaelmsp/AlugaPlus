package com.alugapluscrm.tenant;

import com.alugapluscrm.model.Tenant;
import com.alugapluscrm.repository.TenantRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TenantBootstrap {

    private final TenantRepository tenantRepository;
    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void bootstrapDefaultTenant() {
        tenantRepository.findBySlugIgnoreCase(TenantContext.DEFAULT_TENANT)
                .orElseGet(() -> {
                    Tenant tenant = new Tenant();
                    tenant.setSlug(TenantContext.DEFAULT_TENANT);
                    tenant.setNome("Workspace Padrão");
                    tenant.setStatus("ACTIVE");
                    return tenantRepository.save(tenant);
                });

        jdbcTemplate.update("update contratos set tenant_id = ? where tenant_id is null",
                TenantContext.DEFAULT_TENANT);
    }
}
