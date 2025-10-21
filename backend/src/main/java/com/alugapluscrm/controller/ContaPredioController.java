package com.alugapluscrm.controller;

import com.alugapluscrm.dto.ContaPredioDTO;
import com.alugapluscrm.service.ContaPredioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contas-predio")
@RequiredArgsConstructor
public class ContaPredioController {

    private final ContaPredioService contaPredioService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public Page<ContaPredioDTO> listar(Pageable pageable) {
        return contaPredioService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ContaPredioDTO buscar(@PathVariable Long id) {
        return contaPredioService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ContaPredioDTO> criar(@RequestBody @Valid ContaPredioDTO dto) {
        return ResponseEntity.ok(contaPredioService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ContaPredioDTO> atualizar(@PathVariable Long id, @RequestBody @Valid ContaPredioDTO dto) {
        return ResponseEntity.ok(contaPredioService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        contaPredioService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
