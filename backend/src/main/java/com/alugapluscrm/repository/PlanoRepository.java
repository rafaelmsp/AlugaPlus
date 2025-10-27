package com.alugapluscrm.repository;

import com.alugapluscrm.model.Plano;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlanoRepository extends JpaRepository<Plano, Long> {
    Optional<Plano> findByNomeIgnoreCase(String nome);
    boolean existsByNomeIgnoreCase(String nome);
}
