package com.alugapluscrm.service;

import com.alugapluscrm.dto.InquilinoDTO;
import com.alugapluscrm.model.Inquilino;
import com.alugapluscrm.model.Usuario;
import com.alugapluscrm.repository.InquilinoRepository;
import com.alugapluscrm.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InquilinoService {

    private final InquilinoRepository inquilinoRepository;
    private final UsuarioRepository usuarioRepository;

    @Cacheable(value = "inquilinos")
    public Page<InquilinoDTO> listar(Pageable pageable) {
        return inquilinoRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "inquilino", key = "#id")
    public InquilinoDTO buscar(Long id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = {"inquilinos", "inquilino"}, allEntries = true)
    public InquilinoDTO criar(InquilinoDTO dto) {
        if (inquilinoRepository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF ja cadastrado");
        }
        Inquilino inquilino = new Inquilino();
        atualizarEntidade(inquilino, dto);
        return toDto(inquilinoRepository.save(inquilino));
    }

    @Transactional
    @CacheEvict(value = {"inquilinos", "inquilino"}, allEntries = true)
    public InquilinoDTO atualizar(Long id, InquilinoDTO dto) {
        Inquilino inquilino = buscarEntidade(id);
        if (!inquilino.getCpf().equals(dto.cpf()) && inquilinoRepository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF ja cadastrado");
        }
        atualizarEntidade(inquilino, dto);
        return toDto(inquilinoRepository.save(inquilino));
    }

    @Transactional
    @CacheEvict(value = {"inquilinos", "inquilino"}, allEntries = true)
    public void remover(Long id) {
        inquilinoRepository.deleteById(id);
    }

    @Cacheable(value = "inquilinoUsuario", key = "#usuario.id")
    public InquilinoDTO buscarPorUsuario(Usuario usuario) {
        return inquilinoRepository.findByUsuario(usuario)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Inquilino nao encontrado para usuario informado"));
    }

    private Inquilino buscarEntidade(Long id) {
        return inquilinoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inquilino nao encontrado"));
    }

    private void atualizarEntidade(Inquilino inquilino, InquilinoDTO dto) {
        inquilino.setNome(dto.nome());
        inquilino.setCpf(dto.cpf());
        inquilino.setTelefone(dto.telefone());
        inquilino.setEmail(dto.email());
        inquilino.setEndereco(dto.endereco());
        inquilino.setObservacoes(dto.observacoes());
        if (dto.usuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                    .orElseThrow(() -> new IllegalArgumentException("Usuario vinculado nao encontrado"));
            inquilino.setUsuario(usuario);
        } else {
            inquilino.setUsuario(null);
        }
    }

    private InquilinoDTO toDto(Inquilino inquilino) {
        Long usuarioId = inquilino.getUsuario() != null ? inquilino.getUsuario().getId() : null;
        return new InquilinoDTO(
                inquilino.getId(),
                inquilino.getNome(),
                inquilino.getCpf(),
                inquilino.getTelefone(),
                inquilino.getEmail(),
                inquilino.getEndereco(),
                inquilino.getObservacoes(),
                usuarioId
        );
    }
}
