package com.alugapluscrm.controller;

import com.alugapluscrm.dto.VistoriaDTO;
import com.alugapluscrm.service.VistoriaService;
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
@RequestMapping("/vistorias")
@RequiredArgsConstructor
public class VistoriaController {

    private final VistoriaService vistoriaService;
    private final FileStorageService fileStorageService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR','INQUILINO')")
    public Page<VistoriaDTO> listar(Pageable pageable) {
        return vistoriaService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR','INQUILINO')")
    public VistoriaDTO buscar(@PathVariable Long id) {
        return vistoriaService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<VistoriaDTO> criar(@RequestBody @Valid VistoriaDTO dto) {
        return ResponseEntity.ok(vistoriaService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<VistoriaDTO> atualizar(@PathVariable Long id, @RequestBody @Valid VistoriaDTO dto) {
        return ResponseEntity.ok(vistoriaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        vistoriaService.remover(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/fotos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<VistoriaDTO> uploadFotos(@PathVariable Long id,
                                                   @RequestPart("fotos") List<MultipartFile> fotos) {
        List<String> caminhos = fileStorageService.storeVistoriaFotos(fotos);
        return ResponseEntity.ok(vistoriaService.atualizarFotos(id, caminhos));
    }
}
