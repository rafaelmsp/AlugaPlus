package com.alugapluscrm.controller;

import com.alugapluscrm.dto.ContratoDTO;
import com.alugapluscrm.service.ContratoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/contratos")
@RequiredArgsConstructor
public class ContratoController {

    private final ContratoService contratoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public Page<ContratoDTO> listar(Pageable pageable) {
        return contratoService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR','INQUILINO')")
    public ContratoDTO buscar(@PathVariable("id") Long id) {
        return contratoService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ContratoDTO> criar(@RequestBody @Valid ContratoDTO dto) {
        return ResponseEntity.ok(contratoService.criar(dto));
    }

    @PostMapping(value = "/com-arquivo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ContratoDTO> criarComArquivo(
            @RequestPart("dados") @Valid ContratoDTO dto,
            @RequestPart(value = "arquivo", required = false) MultipartFile arquivo) {
        return ResponseEntity.ok(contratoService.criarComArquivo(dto, arquivo));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ContratoDTO> atualizar(@PathVariable("id") Long id, @RequestBody @Valid ContratoDTO dto) {
        return ResponseEntity.ok(contratoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> remover(@PathVariable("id") Long id) {
        contratoService.remover(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ContratoDTO> uploadContrato(@PathVariable("id") Long id,
                                                      @RequestPart("arquivo") MultipartFile arquivo) {
        return ResponseEntity.ok(contratoService.atualizarArquivo(id, arquivo));
    }
}
