package com.alugapluscrm.dto;

public record InquilinoDTO(
        Long id,
        String nome,
        String cpf,
        String telefone,
        String email,
        String endereco,
        String observacoes,
        Long usuarioId
) {
}
