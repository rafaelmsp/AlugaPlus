package com.alugapluscrm.dto;

import java.math.BigDecimal;

public record PixCheckoutRequest(
        BigDecimal valor,
        String descricao
) {}
