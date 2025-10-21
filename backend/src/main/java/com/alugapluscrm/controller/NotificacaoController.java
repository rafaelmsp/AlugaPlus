package com.alugapluscrm.controller;

import com.alugapluscrm.model.Contrato;
import com.alugapluscrm.model.Pagamento;
import com.alugapluscrm.repository.ContratoRepository;
import com.alugapluscrm.repository.PagamentoRepository;
import com.alugapluscrm.service.NotificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;
    private final PagamentoRepository pagamentoRepository;
    private final ContratoRepository contratoRepository;

    @PostMapping("/pagamentos/{id}/aviso")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> dispararAvisoVencimento(@PathVariable Long id) {
        Pagamento pagamento = pagamentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pagamento nao encontrado"));
        notificacaoService.notificacaoVencimento(pagamento);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/pagamentos/{id}/atraso")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> dispararAvisoAtraso(@PathVariable Long id) {
        Pagamento pagamento = pagamentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pagamento nao encontrado"));
        notificacaoService.notificacaoAtraso(pagamento);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/contratos/{id}/renovacao")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> dispararAvisoRenovacao(@PathVariable Long id) {
        Contrato contrato = contratoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contrato nao encontrado"));
        notificacaoService.notificacaoRenovacaoContrato(contrato);
        return ResponseEntity.ok().build();
    }
}
