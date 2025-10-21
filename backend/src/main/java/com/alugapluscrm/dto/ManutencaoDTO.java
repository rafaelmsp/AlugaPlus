package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.ManutencaoStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ManutencaoDTO(
        Long id,
        Long imovelId,
        Long contratoId,
        LocalDate dataSolicitacao,
        String descricao,
        String responsavel,
        BigDecimal custo,
        ManutencaoStatus status,
        List<String> fotos
) {
}
