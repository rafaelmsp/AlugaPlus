package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.ContratoStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ContratoDTO(
        Long id,
        Long imovelId,
        Long inquilinoId,
        LocalDate dataInicio,
        LocalDate dataFim,
        BigDecimal valorMensal,
        ContratoStatus status,
        String arquivoPdf,
        String hashDocumento,
        LocalDateTime dataUpload,
        String observacao
) {
}
