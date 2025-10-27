package com.alugapluscrm.tenant;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.lang.NonNull;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TenantFilter extends OncePerRequestFilter {

    private final TenantResolver tenantResolver;

    @PersistenceContext
    private EntityManager entityManager;

    public TenantFilter(TenantResolver tenantResolver) {
        this.tenantResolver = tenantResolver;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        TenantContext.setTenantId(tenantResolver.resolveTenant(request));
        Session session = null;
        try {
            session = entityManager.unwrap(Session.class);
            Filter filter = session.enableFilter(TenantConstants.FILTER_NAME);
            filter.setParameter(TenantConstants.FILTER_PARAM, TenantContext.getTenantId());
            filterChain.doFilter(request, response);
        } finally {
            if (session != null) {
                Filter enabled = session.getEnabledFilter(TenantConstants.FILTER_NAME);
                if (enabled != null) {
                    session.disableFilter(TenantConstants.FILTER_NAME);
                }
            }
            TenantContext.clear();
        }
    }
}
