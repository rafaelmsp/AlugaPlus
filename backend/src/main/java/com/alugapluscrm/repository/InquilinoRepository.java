package com.alugapluscrm.repository;

import com.alugapluscrm.model.Inquilino;
import com.alugapluscrm.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InquilinoRepository extends JpaRepository<Inquilino, Long> {
    Optional<Inquilino> findByCpf(String cpf);
    boolean existsByCpf(String cpf);
    Optional<Inquilino> findByUsuario(Usuario usuario);
}
