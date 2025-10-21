package com.alugapluscrm.controller;

import com.alugapluscrm.dto.PagamentoDTO;
import com.alugapluscrm.service.PagamentoService;
import com.alugapluscrm.storage.FileStorageService;
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
@RequestMapping("/pagamentos")
@RequiredArgsConstructor
public class PagamentoController {

    private final PagamentoService pagamentoService;
    private final FileStorageService fileStorageService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public Page<PagamentoDTO> listar(Pageable pageable) {
        return pagamentoService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR','INQUILINO')")
    public PagamentoDTO buscar(@PathVariable Long id) {
        return pagamentoService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<PagamentoDTO> criar(@RequestBody @Valid PagamentoDTO dto) {
        return ResponseEntity.ok(pagamentoService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<PagamentoDTO> atualizar(@PathVariable Long id, @RequestBody @Valid PagamentoDTO dto) {
        return ResponseEntity.ok(pagamentoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        pagamentoService.remover(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/comprovante", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR','INQUILINO')")
    public ResponseEntity<PagamentoDTO> uploadComprovante(@PathVariable Long id,
                                                          @RequestPart("arquivo") MultipartFile arquivo) {
        String caminho = fileStorageService.storeComprovante(arquivo);
        return ResponseEntity.ok(pagamentoService.atualizarComprovante(id, caminho));
    }
}
