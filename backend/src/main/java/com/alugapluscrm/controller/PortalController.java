package com.alugapluscrm.controller;

import com.alugapluscrm.dto.ContratoDTO;
import com.alugapluscrm.dto.InquilinoDTO;
import com.alugapluscrm.dto.PagamentoDTO;
import com.alugapluscrm.dto.VistoriaDTO;
import com.alugapluscrm.model.Usuario;
import com.alugapluscrm.service.ContratoService;
import com.alugapluscrm.service.InquilinoService;
import com.alugapluscrm.service.PagamentoService;
import com.alugapluscrm.service.UsuarioService;
import com.alugapluscrm.service.VistoriaService;
import com.alugapluscrm.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/portal")
@RequiredArgsConstructor
public class PortalController {

    private final UsuarioService usuarioService;
    private final InquilinoService inquilinoService;
    private final ContratoService contratoService;
    private final PagamentoService pagamentoService;
    private final VistoriaService vistoriaService;
    private final FileStorageService fileStorageService;

    @GetMapping("/contratos")
    @PreAuthorize("hasRole('INQUILINO')")
    public List<ContratoDTO> meusContratos() {
        InquilinoDTO inquilino = obterInquilinoAtual();
        return contratoService.listarPorInquilino(inquilino.id());
    }

    @GetMapping("/contratos/{contratoId}/pagamentos")
    @PreAuthorize("hasRole('INQUILINO')")
    public List<PagamentoDTO> meusPagamentos(@PathVariable Long contratoId) {
        validarContrato(contratoId);
        return pagamentoService.listarPorContrato(contratoId);
    }

    @GetMapping("/contratos/{contratoId}/vistorias")
    @PreAuthorize("hasRole('INQUILINO')")
    public List<VistoriaDTO> minhasVistorias(@PathVariable Long contratoId) {
        validarContrato(contratoId);
        return vistoriaService.listarPorContrato(contratoId);
    }

    @PostMapping(value = "/pagamentos/{id}/comprovante", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('INQUILINO')")
    public ResponseEntity<PagamentoDTO> enviarComprovante(@PathVariable Long id,
                                                          @RequestPart("arquivo") MultipartFile arquivo) {
        PagamentoDTO pagamento = pagamentoService.buscar(id);
        validarContrato(pagamento.contratoId());
        String caminho = fileStorageService.storeComprovante(arquivo);
        return ResponseEntity.ok(pagamentoService.atualizarComprovante(id, caminho));
    }

    private InquilinoDTO obterInquilinoAtual() {
        Usuario usuario = usuarioService.obterUsuarioAutenticado();
        return inquilinoService.buscarPorUsuario(usuario);
    }

    private void validarContrato(Long contratoId) {
        InquilinoDTO inquilino = obterInquilinoAtual();
        boolean possuiContrato = contratoService.listarPorInquilino(inquilino.id())
                .stream()
                .anyMatch(contrato -> contrato.id().equals(contratoId));
        if (!possuiContrato) {
            throw new AccessDeniedException("Contrato nao pertence ao inquilino autenticado");
        }
    }
}
