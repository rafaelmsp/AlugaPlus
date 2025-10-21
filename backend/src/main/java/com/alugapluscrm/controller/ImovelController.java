package com.alugapluscrm.controller;

import com.alugapluscrm.dto.ImovelDTO;
import com.alugapluscrm.service.ImovelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/imoveis")
@RequiredArgsConstructor
public class ImovelController {

    private final ImovelService imovelService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public Page<ImovelDTO> listar(Pageable pageable) {
        return imovelService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR','INQUILINO')")
    public ImovelDTO buscar(@PathVariable("id") Long id) {
        return imovelService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ImovelDTO> criar(@RequestBody @Valid ImovelDTO dto) {
        return ResponseEntity.ok(imovelService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ImovelDTO> atualizar(@PathVariable("id") Long id, @RequestBody @Valid ImovelDTO dto) {
        return ResponseEntity.ok(imovelService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> remover(@PathVariable("id") Long id) {
        imovelService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
