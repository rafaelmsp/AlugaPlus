package com.alugapluscrm.controller;

import com.alugapluscrm.dto.PlanoDTO;
import com.alugapluscrm.service.PlanoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planos")
@RequiredArgsConstructor
public class PlanoController {

    private final PlanoService planoService;

    @GetMapping
    public List<PlanoDTO> listarPublicos() {
        return planoService.listarAtivos();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<PlanoDTO> listar(Pageable pageable) {
        return planoService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PlanoDTO buscar(@PathVariable Long id) {
        return planoService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlanoDTO> criar(@RequestBody @Valid PlanoDTO dto) {
        return ResponseEntity.ok(planoService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlanoDTO> atualizar(@PathVariable Long id, @RequestBody @Valid PlanoDTO dto) {
        return ResponseEntity.ok(planoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        planoService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
