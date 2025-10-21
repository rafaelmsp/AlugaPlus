package com.alugapluscrm.controller;

import com.alugapluscrm.dto.MovimentacaoFinanceiraDTO;
import com.alugapluscrm.service.MovimentacaoFinanceiraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/financeiro")
@RequiredArgsConstructor
public class FinanceiroController {

    private final MovimentacaoFinanceiraService movimentacaoFinanceiraService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public Page<MovimentacaoFinanceiraDTO> listar(Pageable pageable) {
        return movimentacaoFinanceiraService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public MovimentacaoFinanceiraDTO buscar(@PathVariable Long id) {
        return movimentacaoFinanceiraService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<MovimentacaoFinanceiraDTO> criar(@RequestBody @Valid MovimentacaoFinanceiraDTO dto) {
        return ResponseEntity.ok(movimentacaoFinanceiraService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<MovimentacaoFinanceiraDTO> atualizar(@PathVariable Long id,
                                                               @RequestBody @Valid MovimentacaoFinanceiraDTO dto) {
        return ResponseEntity.ok(movimentacaoFinanceiraService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        movimentacaoFinanceiraService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
