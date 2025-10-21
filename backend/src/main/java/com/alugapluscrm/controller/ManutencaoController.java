package com.alugapluscrm.controller;

import com.alugapluscrm.dto.ManutencaoDTO;
import com.alugapluscrm.service.ManutencaoService;
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

import java.util.List;

@RestController
@RequestMapping("/manutencoes")
@RequiredArgsConstructor
public class ManutencaoController {

    private final ManutencaoService manutencaoService;
    private final FileStorageService fileStorageService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public Page<ManutencaoDTO> listar(Pageable pageable) {
        return manutencaoService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ManutencaoDTO buscar(@PathVariable Long id) {
        return manutencaoService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ManutencaoDTO> criar(@RequestBody @Valid ManutencaoDTO dto) {
        return ResponseEntity.ok(manutencaoService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ManutencaoDTO> atualizar(@PathVariable Long id, @RequestBody @Valid ManutencaoDTO dto) {
        return ResponseEntity.ok(manutencaoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        manutencaoService.remover(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/fotos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<ManutencaoDTO> uploadFotos(@PathVariable Long id,
                                                     @RequestPart("fotos") List<MultipartFile> fotos) {
        List<String> caminhos = fileStorageService.storeManutencaoFotos(fotos);
        return ResponseEntity.ok(manutencaoService.atualizarFotos(id, caminhos));
    }
}
