package com.alugapluscrm.service;

import com.alugapluscrm.dto.PlanoDTO;
import com.alugapluscrm.model.Plano;
import com.alugapluscrm.repository.PlanoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanoService {

    private final PlanoRepository planoRepository;

    @Cacheable(value = "planosAtivos")
    public List<PlanoDTO> listarAtivos() {
        return planoRepository.findAll().stream()
                .filter(Plano::getAtivo)
                .map(this::toDto)
                .toList();
    }

    @Cacheable(value = "planos", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<PlanoDTO> listar(Pageable pageable) {
        return planoRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "plano", key = "#id")
    public PlanoDTO buscar(Long id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = {"planosAtivos", "planos", "plano"}, allEntries = true)
    public PlanoDTO criar(PlanoDTO dto) {
        if (planoRepository.existsByNomeIgnoreCase(dto.nome())) {
            throw new IllegalArgumentException("Plano com este nome já existe");
        }
        Plano plano = fromDto(dto);
        plano.setId(null);
        return toDto(planoRepository.save(plano));
    }

    @Transactional
    @CacheEvict(value = {"planosAtivos", "planos", "plano"}, allEntries = true)
    public PlanoDTO atualizar(Long id, PlanoDTO dto) {
        Plano existente = buscarEntidade(id);
        if (!existente.getNome().equalsIgnoreCase(dto.nome())
                && planoRepository.existsByNomeIgnoreCase(dto.nome())) {
            throw new IllegalArgumentException("Plano com este nome já existe");
        }
        existente.setNome(dto.nome());
        existente.setDescricao(dto.descricao());
        existente.setValorMensal(dto.valorMensal());
        existente.setQtdeUsuarios(dto.qtdeUsuarios());
        existente.setQtdeImoveis(dto.qtdeImoveis());
        existente.setQtdeContratos(dto.qtdeContratos());
        existente.setRecursosExtras(dto.recursosExtras());
        existente.setAtivo(dto.ativo() != null ? dto.ativo() : Boolean.TRUE);
        return toDto(planoRepository.save(existente));
    }

    @Transactional
    @CacheEvict(value = {"planosAtivos", "planos", "plano"}, allEntries = true)
    public void desativar(Long id) {
        Plano plano = buscarEntidade(id);
        plano.setAtivo(Boolean.FALSE);
        planoRepository.save(plano);
    }

    public Plano buscarEntidade(Long id) {
        return planoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plano não encontrado"));
    }

    private PlanoDTO toDto(Plano plano) {
        return new PlanoDTO(
                plano.getId(),
                plano.getNome(),
                plano.getDescricao(),
                plano.getValorMensal(),
                plano.getQtdeUsuarios(),
                plano.getQtdeImoveis(),
                plano.getQtdeContratos(),
                plano.getRecursosExtras(),
                plano.getAtivo()
        );
    }

    private Plano fromDto(PlanoDTO dto) {
        return Plano.builder()
                .nome(dto.nome())
                .descricao(dto.descricao())
                .valorMensal(dto.valorMensal())
                .qtdeUsuarios(dto.qtdeUsuarios())
                .qtdeImoveis(dto.qtdeImoveis())
                .qtdeContratos(dto.qtdeContratos())
                .recursosExtras(dto.recursosExtras())
                .ativo(dto.ativo() != null ? dto.ativo() : Boolean.TRUE)
                .build();
    }
}
