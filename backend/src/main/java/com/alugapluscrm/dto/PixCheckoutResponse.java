package com.alugapluscrm.dto;

import java.math.BigDecimal;

public record PixCheckoutResponse(
        String chavePix,
        String qrCode,
        BigDecimal valor,
        String descricao
) {}
