package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.FormaPagamento;
import jakarta.validation.constraints.NotNull;

public record AssinaturaRequest(
        @NotNull Long planoId,
        @NotNull FormaPagamento formaPagamento
) {}
