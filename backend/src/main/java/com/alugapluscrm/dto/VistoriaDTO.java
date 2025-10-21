package com.alugapluscrm.dto;

import com.alugapluscrm.model.enums.VistoriaTipo;

import java.time.LocalDate;
import java.util.List;

public record VistoriaDTO(
        Long id,
        Long imovelId,
        Long contratoId,
        LocalDate dataVistoria,
        VistoriaTipo tipo,
        String observacoes,
        List<String> fotos,
        Integer avaliacao
) {
}
