package com.alugapluscrm.controller;

import com.alugapluscrm.service.RelatorioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/relatorios")
@RequiredArgsConstructor
public class RelatorioController {

    private final RelatorioService relatorioService;

    @GetMapping("/financeiro/pdf")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<byte[]> relatorioFinanceiroPdf() {
        byte[] pdf = relatorioService.gerarRelatorioFinanceiroPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_financeiro.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/financeiro/excel")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<byte[]> relatorioFinanceiroExcel() {
        byte[] excel = relatorioService.gerarRelatorioFinanceiroExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_financeiro.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}
