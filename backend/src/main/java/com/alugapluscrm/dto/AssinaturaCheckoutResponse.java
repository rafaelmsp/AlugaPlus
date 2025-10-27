package com.alugapluscrm.dto;

public record AssinaturaCheckoutResponse(
        AssinaturaDTO assinatura,
        PixCheckoutResponse pix
) {}
