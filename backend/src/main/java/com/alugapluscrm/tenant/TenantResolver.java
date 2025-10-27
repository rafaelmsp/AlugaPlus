package com.alugapluscrm.tenant;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class TenantResolver {

    public String resolveTenant(HttpServletRequest request) {
        String headerValue = request.getHeader(TenantConstants.HEADER_NAME);
        if (StringUtils.hasText(headerValue)) {
            return headerValue.trim();
        }

        String queryValue = request.getParameter("tenant");
        if (StringUtils.hasText(queryValue)) {
            return queryValue.trim();
        }

        return TenantContext.DEFAULT_TENANT;
    }
}
