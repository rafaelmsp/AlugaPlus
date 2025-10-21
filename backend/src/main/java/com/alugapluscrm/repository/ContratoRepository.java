package com.alugapluscrm.repository;

import com.alugapluscrm.model.Contrato;
import com.alugapluscrm.model.Inquilino;
import com.alugapluscrm.model.enums.ContratoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {
    List<Contrato> findByInquilino(Inquilino inquilino);
    List<Contrato> findByStatus(ContratoStatus status);
    List<Contrato> findByDataFimBetween(LocalDate inicio, LocalDate fim);
}
