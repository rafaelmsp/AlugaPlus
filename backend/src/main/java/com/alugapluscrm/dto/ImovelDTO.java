package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.ImovelStatus;
import com.alugapluscrm.model.enums.ImovelTipo;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ImovelDTO(
        Long id,
        String endereco,
        ImovelTipo tipo,
        BigDecimal valorAluguel,
        ImovelStatus status,
        String descricao,
        String fotoCapa,
        LocalDate dataCadastro,
        Long predioId
) {
}
