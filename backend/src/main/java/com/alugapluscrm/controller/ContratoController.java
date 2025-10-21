package com.alugapluscrm.controller;

import com.alugapluscrm.dto.ContratoDTO;
import com.alugapluscrm.service.ContratoService;
import com.alugapluscrm.storage.FileStorageService;
import com.alugapluscrm.util.HashUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/contratos")
@RequiredArgsConstructor
public class ContratoController {

    private final ContratoService contratoService;
    private final FileStorageService fileStorageService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public Page<ContratoDTO> listar(Pageable pageable) {
        return contratoService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR','INQUILINO')")
    public ContratoDTO buscar(@PathVariable Long id) {
        return contratoService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ContratoDTO> criar(@RequestBody @Valid ContratoDTO dto) {
        return ResponseEntity.ok(contratoService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ContratoDTO> atualizar(@PathVariable Long id, @RequestBody @Valid ContratoDTO dto) {
        return ResponseEntity.ok(contratoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        contratoService.remover(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ContratoDTO> uploadContrato(@PathVariable Long id,
                                                      @RequestPart("arquivo") MultipartFile arquivo) {
        try {
            String hash = HashUtil.sha256(arquivo.getInputStream());
            String caminho = fileStorageService.storeContrato(arquivo);
            return ResponseEntity.ok(contratoService.atualizarArquivo(id, caminho, hash));
        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar arquivo de contrato", e);
        }
    }
}
