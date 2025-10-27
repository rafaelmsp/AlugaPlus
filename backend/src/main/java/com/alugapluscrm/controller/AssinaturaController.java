package com.alugapluscrm.controller;

import com.alugapluscrm.dto.AssinaturaCheckoutResponse;
import com.alugapluscrm.dto.AssinaturaDTO;
import com.alugapluscrm.dto.AssinaturaRequest;
import com.alugapluscrm.service.AssinaturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/assinaturas")
@RequiredArgsConstructor
public class AssinaturaController {

    private final AssinaturaService assinaturaService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<AssinaturaDTO> listar(Pageable pageable) {
        return assinaturaService.listarTodas(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AssinaturaDTO buscar(@PathVariable Long id) {
        return assinaturaService.buscarPorId(id);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('GESTOR','PROPRIETARIO')")
    public ResponseEntity<AssinaturaDTO> minhaAssinatura() {
        Optional<AssinaturaDTO> assinatura = assinaturaService.assinaturaAtualDoUsuario();
        return assinatura.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GESTOR','PROPRIETARIO')")
    public ResponseEntity<AssinaturaCheckoutResponse> criar(@RequestBody @Valid AssinaturaRequest request) {
        return ResponseEntity.ok(assinaturaService.criar(request));
    }

    @PutMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('GESTOR','PROPRIETARIO','ADMIN')")
    public ResponseEntity<AssinaturaDTO> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(assinaturaService.cancelar(id));
    }
}
