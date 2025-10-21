package com.alugapluscrm.repository;

import com.alugapluscrm.model.Imovel;
import com.alugapluscrm.model.enums.ImovelStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImovelRepository extends JpaRepository<Imovel, Long> {
    List<Imovel> findByStatus(ImovelStatus status);
}
