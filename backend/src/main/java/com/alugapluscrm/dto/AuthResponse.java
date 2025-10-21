package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.UserRole;

public record AuthResponse(
        String token,
        String nome,
        String email,
        UserRole role
) {
}
