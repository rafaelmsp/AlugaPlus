package com.alugapluscrm.tenant;

public interface TenantScoped {
    String getTenantId();
    void setTenantId(String tenantId);
}
