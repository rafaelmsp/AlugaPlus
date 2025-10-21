package com.alugapluscrm.repository;

import com.alugapluscrm.model.Pagamento;
import com.alugapluscrm.model.enums.PagamentoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    List<Pagamento> findByStatus(PagamentoStatus status);
    List<Pagamento> findByDataVencimentoBetween(LocalDate inicio, LocalDate fim);
    List<Pagamento> findByContratoId(Long contratoId);
}
