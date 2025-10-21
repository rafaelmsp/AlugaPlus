package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.FormaPagamento;
import com.alugapluscrm.model.enums.PagamentoStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PagamentoDTO(
        Long id,
        Long contratoId,
        LocalDate dataVencimento,
        LocalDate dataPagamento,
        BigDecimal valor,
        PagamentoStatus status,
        FormaPagamento formaPagamento,
        String observacao,
        String comprovante
) {
}
