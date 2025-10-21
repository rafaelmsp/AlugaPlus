package com.alugapluscrm.repository;

import com.alugapluscrm.model.Vistoria;
import com.alugapluscrm.model.enums.VistoriaTipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface VistoriaRepository extends JpaRepository<Vistoria, Long> {
    List<Vistoria> findByTipo(VistoriaTipo tipo);
    List<Vistoria> findByDataVistoriaBetween(LocalDate inicio, LocalDate fim);
    List<Vistoria> findByContratoId(Long contratoId);
}
