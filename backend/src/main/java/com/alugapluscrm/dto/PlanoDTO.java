package com.alugapluscrm.dto;

import java.math.BigDecimal;

public record PlanoDTO(
        Long id,
        String nome,
        String descricao,
        BigDecimal valorMensal,
        Integer qtdeUsuarios,
        Integer qtdeImoveis,
        Integer qtdeContratos,
        String recursosExtras,
        Boolean ativo
) {}
