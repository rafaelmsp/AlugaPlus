package com.alugapluscrm.service;

import com.alugapluscrm.dto.RegisterRequest;
import com.alugapluscrm.dto.UsuarioDTO;
import com.alugapluscrm.model.Usuario;
import com.alugapluscrm.model.enums.UserRole;
import com.alugapluscrm.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado"));
        return User.withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .roles(usuario.getRole().name())
                .build();
    }

    @Transactional
    @CacheEvict(value = "usuarios", allEntries = true)
    public Usuario registrar(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email ja cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .role(request.role())
                .build();
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario ensureAdminUser() {
        final String adminEmail = "admin@alugaplus.com";
        Optional<Usuario> existing = usuarioRepository.findByEmail(adminEmail);
        if (existing.isPresent()) {
            return existing.get();
        }

        Usuario admin = Usuario.builder()
                .nome("Administrador AlugaPlus")
                .email(adminEmail)
                .senha(passwordEncoder.encode("123456"))
                .role(UserRole.ADMIN)
                .build();
        return usuarioRepository.save(admin);
    }

    @Cacheable(value = "usuariosList")
    public Page<UsuarioDTO> listar(Pageable pageable) {
        return usuarioRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "usuarios", key = "#p0")
    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado"));
    }

    public Usuario obterUsuarioAutenticado() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails principal)) {
            throw new UsernameNotFoundException("Nenhum usuario autenticado");
        }
        return findByEmail(principal.getUsername());
    }

    private UsuarioDTO toDto(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole()
        );
    }
}
