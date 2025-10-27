package com.alugapluscrm.tenant;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

public class TenantEntityListener {

    @PrePersist
    public void beforePersist(Object entity) {
        applyTenant(entity);
    }

    @PreUpdate
    public void beforeUpdate(Object entity) {
        applyTenant(entity);
    }

    private void applyTenant(Object entity) {
        if (!(entity instanceof TenantScoped scoped)) {
            return;
        }
        if (scoped.getTenantId() == null || scoped.getTenantId().isBlank()) {
            scoped.setTenantId(TenantContext.getTenantId());
        }
    }
}
