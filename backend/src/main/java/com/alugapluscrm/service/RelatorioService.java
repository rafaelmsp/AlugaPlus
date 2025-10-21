package com.alugapluscrm.service;

import com.alugapluscrm.model.MovimentacaoFinanceira;
import com.alugapluscrm.repository.MovimentacaoFinanceiraRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RelatorioService {

    private final MovimentacaoFinanceiraRepository movimentacaoFinanceiraRepository;

    public byte[] gerarRelatorioFinanceiroPdf() {
        List<MovimentacaoFinanceira> movimentacoes = movimentacaoFinanceiraRepository.findAll();
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
                contentStream.beginText();
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("Relatorio Financeiro AlugaPlus");
                contentStream.endText();

                contentStream.setFont(PDType1Font.HELVETICA, 12);
                int y = 720;
                for (MovimentacaoFinanceira mov : movimentacoes) {
                    if (y < 50) {
                        contentStream.close();
                        page = new PDPage();
                        document.addPage(page);
                        y = 750;
                    }
                    try (PDPageContentStream pageStream = new PDPageContentStream(document, page,
                            PDPageContentStream.AppendMode.APPEND, true, true)) {
                        pageStream.beginText();
                        pageStream.newLineAtOffset(50, y);
                        pageStream.showText(formatarLinha(mov));
                        pageStream.endText();
                    }
                    y -= 20;
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Erro ao gerar relatorio PDF", e);
        }
    }

    public byte[] gerarRelatorioFinanceiroExcel() {
        List<MovimentacaoFinanceira> movimentacoes = movimentacaoFinanceiraRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Financeiro");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Tipo");
            header.createCell(2).setCellValue("Categoria");
            header.createCell(3).setCellValue("Descricao");
            header.createCell(4).setCellValue("Valor");
            header.createCell(5).setCellValue("Data");

            int rowIndex = 1;
            for (MovimentacaoFinanceira mov : movimentacoes) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(mov.getId());
                row.createCell(1).setCellValue(mov.getTipo().name());
                row.createCell(2).setCellValue(mov.getCategoria());
                row.createCell(3).setCellValue(mov.getDescricao());
                row.createCell(4).setCellValue(mov.getValor().doubleValue());
                row.createCell(5).setCellValue(mov.getData() != null ? mov.getData().toString() : "");
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);
            sheet.autoSizeColumn(2);
            sheet.autoSizeColumn(3);
            sheet.autoSizeColumn(4);
            sheet.autoSizeColumn(5);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Erro ao gerar relatorio Excel", e);
        }
    }

    private String formatarLinha(MovimentacaoFinanceira movimentacao) {
        return String.format("ID %d - %s - %s - Valor: %s - Data: %s",
                movimentacao.getId(),
                movimentacao.getTipo(),
                movimentacao.getCategoria(),
                movimentacao.getValor(),
                movimentacao.getData());
    }
}
