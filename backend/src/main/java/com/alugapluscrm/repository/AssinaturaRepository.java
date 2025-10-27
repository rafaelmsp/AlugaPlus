package com.alugapluscrm.repository;

import com.alugapluscrm.model.Assinatura;
import com.alugapluscrm.model.Usuario;
import com.alugapluscrm.model.enums.AssinaturaStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AssinaturaRepository extends JpaRepository<Assinatura, Long> {
    Optional<Assinatura> findFirstByUsuarioAndStatusIn(Usuario usuario, Iterable<AssinaturaStatus> status);
    boolean existsByUsuarioAndStatusIn(Usuario usuario, Iterable<AssinaturaStatus> status);
    Optional<Assinatura> findFirstByTenantIdAndStatusIn(String tenantId, Iterable<AssinaturaStatus> status);
    boolean existsByTenantIdAndStatusIn(String tenantId, Iterable<AssinaturaStatus> status);
}
