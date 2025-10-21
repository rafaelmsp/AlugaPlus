package com.alugapluscrm.dto;

public record PredioDTO(
        Long id,
        String nome,
        String endereco,
        Integer numeroUnidades,
        String sindico,
        String contato,
        String observacoes
) {
}
