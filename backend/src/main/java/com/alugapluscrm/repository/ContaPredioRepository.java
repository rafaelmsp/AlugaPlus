package com.alugapluscrm.repository;

import com.alugapluscrm.model.ContaPredio;
import com.alugapluscrm.model.enums.ContaPredioStatus;
import com.alugapluscrm.model.enums.ContaPredioTipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContaPredioRepository extends JpaRepository<ContaPredio, Long> {
    List<ContaPredio> findByStatus(ContaPredioStatus status);
    List<ContaPredio> findByTipo(ContaPredioTipo tipo);
}
