package com.alugapluscrm.tenant;

import java.util.Optional;

public final class TenantContext {

    public static final String DEFAULT_TENANT = "DEFAULT";

    private static final ThreadLocal<String> CURRENT = new ThreadLocal<>();

    private TenantContext() {
    }

    public static void setTenantId(String tenantId) {
        CURRENT.set(Optional.ofNullable(tenantId).filter(s -> !s.isBlank()).map(String::trim).orElse(DEFAULT_TENANT));
    }

    public static String getTenantId() {
        return Optional.ofNullable(CURRENT.get()).orElse(DEFAULT_TENANT);
    }

    public static void clear() {
        CURRENT.remove();
    }

    public static String cacheKey(Object suffix) {
        return getTenantId() + ":" + String.valueOf(suffix);
    }
}
