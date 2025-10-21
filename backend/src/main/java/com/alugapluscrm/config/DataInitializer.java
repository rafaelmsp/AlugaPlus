package com.alugapluscrm.config;

import com.alugapluscrm.service.UsuarioService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UsuarioService usuarioService;

    @PostConstruct
    public void init() {
        usuarioService.ensureAdminUser();
    }
}
