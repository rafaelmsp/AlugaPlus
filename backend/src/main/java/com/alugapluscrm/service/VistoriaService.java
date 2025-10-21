package com.alugapluscrm.service;

import com.alugapluscrm.dto.VistoriaDTO;
import com.alugapluscrm.model.Contrato;
import com.alugapluscrm.model.Imovel;
import com.alugapluscrm.model.Vistoria;
import com.alugapluscrm.repository.ContratoRepository;
import com.alugapluscrm.repository.ImovelRepository;
import com.alugapluscrm.repository.VistoriaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class VistoriaService {

    private final VistoriaRepository vistoriaRepository;
    private final ImovelRepository imovelRepository;
    private final ContratoRepository contratoRepository;

    @Cacheable(value = "vistorias")
    public Page<VistoriaDTO> listar(Pageable pageable) {
        return vistoriaRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "vistoria", key = "#id")
    public VistoriaDTO buscar(Long id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = {"vistorias", "vistoria"}, allEntries = true)
    public VistoriaDTO criar(VistoriaDTO dto) {
        Vistoria vistoria = new Vistoria();
        atualizarEntidade(vistoria, dto);
        return toDto(vistoriaRepository.save(vistoria));
    }

    @Transactional
    @CacheEvict(value = {"vistorias", "vistoria"}, allEntries = true)
    public VistoriaDTO atualizar(Long id, VistoriaDTO dto) {
        Vistoria vistoria = buscarEntidade(id);
        atualizarEntidade(vistoria, dto);
        return toDto(vistoriaRepository.save(vistoria));
    }

    @Transactional
    @CacheEvict(value = {"vistorias", "vistoria"}, allEntries = true)
    public void remover(Long id) {
        vistoriaRepository.deleteById(id);
    }

    @Transactional
    @CacheEvict(value = {"vistorias", "vistoria"}, allEntries = true)
    public VistoriaDTO atualizarFotos(Long id, java.util.List<String> fotos) {
        Vistoria vistoria = buscarEntidade(id);
        vistoria.setFotos(fotos != null ? new java.util.ArrayList<>(fotos) : new java.util.ArrayList<>());
        Vistoria salvo = vistoriaRepository.save(vistoria);
        return toDto(salvo);
    }

    public java.util.List<VistoriaDTO> listarPorContrato(Long contratoId) {
        return vistoriaRepository.findByContratoId(contratoId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private Vistoria buscarEntidade(Long id) {
        return vistoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vistoria nao encontrada"));
    }

    private void atualizarEntidade(Vistoria vistoria, VistoriaDTO dto) {
        Imovel imovel = imovelRepository.findById(dto.imovelId())
                .orElseThrow(() -> new IllegalArgumentException("Imovel nao encontrado para vistoria"));
        vistoria.setImovel(imovel);
        if (dto.contratoId() != null) {
            Contrato contrato = contratoRepository.findById(dto.contratoId())
                    .orElseThrow(() -> new IllegalArgumentException("Contrato nao encontrado para vistoria"));
            vistoria.setContrato(contrato);
        } else {
            vistoria.setContrato(null);
        }
        vistoria.setDataVistoria(dto.dataVistoria());
        vistoria.setTipo(dto.tipo());
        vistoria.setObservacoes(dto.observacoes());
        vistoria.setFotos(dto.fotos() != null ? new ArrayList<>(dto.fotos()) : new ArrayList<>());
        vistoria.setAvaliacao(dto.avaliacao());
    }

    private VistoriaDTO toDto(Vistoria vistoria) {
        return new VistoriaDTO(
                vistoria.getId(),
                vistoria.getImovel() != null ? vistoria.getImovel().getId() : null,
                vistoria.getContrato() != null ? vistoria.getContrato().getId() : null,
                vistoria.getDataVistoria(),
                vistoria.getTipo(),
                vistoria.getObservacoes(),
                vistoria.getFotos(),
                vistoria.getAvaliacao()
        );
    }
}
