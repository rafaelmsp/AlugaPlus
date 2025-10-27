package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.AssinaturaStatus;
import com.alugapluscrm.model.enums.FormaPagamento;

import java.time.LocalDate;

public record AssinaturaDTO(
        Long id,
        Long usuarioId,
        Long planoId,
        String planoNome,
        LocalDate dataInicio,
        LocalDate dataFim,
        AssinaturaStatus status,
        FormaPagamento formaPagamento,
        String chavePix,
        String transacaoId
) {}
