package com.alugapluscrm.controller;

import com.alugapluscrm.dto.PredioDTO;
import com.alugapluscrm.service.PredioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/predios")
@RequiredArgsConstructor
public class PredioController {

    private final PredioService predioService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public Page<PredioDTO> listar(Pageable pageable) {
        return predioService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public PredioDTO buscar(@PathVariable Long id) {
        return predioService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<PredioDTO> criar(@RequestBody @Valid PredioDTO dto) {
        return ResponseEntity.ok(predioService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<PredioDTO> atualizar(@PathVariable Long id, @RequestBody @Valid PredioDTO dto) {
        return ResponseEntity.ok(predioService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        predioService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
