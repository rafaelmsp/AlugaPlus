package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.PagamentoStatus;

import java.time.LocalDate;

public record AtualizaStatusPagamentoRequest(
        PagamentoStatus status,
        LocalDate dataPagamento,
        String observacao
) {
}

