package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @NotBlank String nome,
        @Email @NotBlank String email,
        @NotBlank String senha,
        @NotNull UserRole role
) {
}
