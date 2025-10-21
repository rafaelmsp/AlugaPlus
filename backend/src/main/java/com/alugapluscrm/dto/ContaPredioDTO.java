package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.ContaPredioStatus;
import com.alugapluscrm.model.enums.ContaPredioTipo;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContaPredioDTO(
        Long id,
        Long predioId,
        ContaPredioTipo tipo,
        BigDecimal valor,
        Integer mesReferencia,
        Integer anoReferencia,
        LocalDate vencimento,
        LocalDate dataPagamento,
        String comprovante,
        ContaPredioStatus status,
        boolean recorrente,
        String observacao
) {
}
