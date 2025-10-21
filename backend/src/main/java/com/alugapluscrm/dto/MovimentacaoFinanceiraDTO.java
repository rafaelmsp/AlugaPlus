package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.FormaPagamento;
import com.alugapluscrm.model.enums.MovimentacaoStatus;
import com.alugapluscrm.model.enums.MovimentacaoTipo;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MovimentacaoFinanceiraDTO(
        Long id,
        MovimentacaoTipo tipo,
        String categoria,
        String descricao,
        BigDecimal valor,
        LocalDate data,
        Long imovelId,
        Long contratoId,
        String comprovante,
        MovimentacaoStatus status,
        FormaPagamento formaPagamento,
        String referencia
) {
}
