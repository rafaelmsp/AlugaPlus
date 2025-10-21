package com.alugapluscrm.service;

import com.alugapluscrm.dto.PredioDTO;
import com.alugapluscrm.model.Predio;
import com.alugapluscrm.repository.PredioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PredioService {

    private final PredioRepository predioRepository;

    @Cacheable(value = "predios")
    public Page<PredioDTO> listar(Pageable pageable) {
        return predioRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "predio", key = "#id")
    public PredioDTO buscar(Long id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = {"predios", "predio"}, allEntries = true)
    public PredioDTO criar(PredioDTO dto) {
        Predio predio = new Predio();
        atualizarEntidade(predio, dto);
        return toDto(predioRepository.save(predio));
    }

    @Transactional
    @CacheEvict(value = {"predios", "predio"}, allEntries = true)
    public PredioDTO atualizar(Long id, PredioDTO dto) {
        Predio predio = buscarEntidade(id);
        atualizarEntidade(predio, dto);
        return toDto(predioRepository.save(predio));
    }

    @Transactional
    @CacheEvict(value = {"predios", "predio"}, allEntries = true)
    public void remover(Long id) {
        predioRepository.deleteById(id);
    }

    private Predio buscarEntidade(Long id) {
        return predioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Predio nao encontrado"));
    }

    private void atualizarEntidade(Predio predio, PredioDTO dto) {
        predio.setNome(dto.nome());
        predio.setEndereco(dto.endereco());
        predio.setNumeroUnidades(dto.numeroUnidades());
        predio.setSindico(dto.sindico());
        predio.setContato(dto.contato());
        predio.setObservacoes(dto.observacoes());
    }

    private PredioDTO toDto(Predio predio) {
        return new PredioDTO(
                predio.getId(),
                predio.getNome(),
                predio.getEndereco(),
                predio.getNumeroUnidades(),
                predio.getSindico(),
                predio.getContato(),
                predio.getObservacoes()
        );
    }
}
