package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.UserRole;

public record UsuarioDTO(
        Long id,
        String nome,
        String email,
        UserRole role
) {
}

