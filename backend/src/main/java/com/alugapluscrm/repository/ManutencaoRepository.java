package com.alugapluscrm.repository;

import com.alugapluscrm.model.Manutencao;
import com.alugapluscrm.model.enums.ManutencaoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {
    List<Manutencao> findByStatus(ManutencaoStatus status);
    List<Manutencao> findByDataSolicitacaoBetween(LocalDate inicio, LocalDate fim);
}
