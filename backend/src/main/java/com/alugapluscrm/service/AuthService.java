package com.alugapluscrm.service;

import com.alugapluscrm.config.JwtService;
import com.alugapluscrm.dto.AuthRequest;
import com.alugapluscrm.dto.AuthResponse;
import com.alugapluscrm.dto.RegisterRequest;
import com.alugapluscrm.model.Usuario;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        UserDetails principal = (UserDetails) authentication.getPrincipal();
        Usuario usuario = usuarioService.findByEmail(principal.getUsername());
        String token = jwtService.generateToken(principal);
        return new AuthResponse(token, usuario.getNome(), usuario.getEmail(), usuario.getRole());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        Usuario usuario = usuarioService.registrar(request);
        UserDetails principal = usuarioService.loadUserByUsername(usuario.getEmail());
        String token = jwtService.generateToken(principal);
        return new AuthResponse(token, usuario.getNome(), usuario.getEmail(), usuario.getRole());
    }
}
