package com.alugapluscrm.repository;

import com.alugapluscrm.model.MovimentacaoFinanceira;
import com.alugapluscrm.model.enums.MovimentacaoTipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MovimentacaoFinanceiraRepository extends JpaRepository<MovimentacaoFinanceira, Long> {
    List<MovimentacaoFinanceira> findByTipo(MovimentacaoTipo tipo);
    List<MovimentacaoFinanceira> findByDataBetween(LocalDate inicio, LocalDate fim);
    Optional<MovimentacaoFinanceira> findByReferencia(String referencia);
}
