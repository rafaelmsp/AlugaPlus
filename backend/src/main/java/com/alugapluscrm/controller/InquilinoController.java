package com.alugapluscrm.controller;

import com.alugapluscrm.dto.InquilinoDTO;
import com.alugapluscrm.model.Usuario;
import com.alugapluscrm.service.InquilinoService;
import com.alugapluscrm.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inquilinos")
@RequiredArgsConstructor
public class InquilinoController {

    private final InquilinoService inquilinoService;
    private final UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public Page<InquilinoDTO> listar(Pageable pageable) {
        return inquilinoService.listar(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public InquilinoDTO buscar(@PathVariable Long id) {
        return inquilinoService.buscar(id);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('INQUILINO')")
    public InquilinoDTO meusDados() {
        Usuario usuario = usuarioService.obterUsuarioAutenticado();
        return inquilinoService.buscarPorUsuario(usuario);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<InquilinoDTO> criar(@RequestBody InquilinoDTO dto) {
        return ResponseEntity.ok(inquilinoService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<InquilinoDTO> atualizar(@PathVariable Long id, @RequestBody InquilinoDTO dto) {
        return ResponseEntity.ok(inquilinoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        inquilinoService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
