package com.alugapluscrm.service;

import com.alugapluscrm.dto.ImovelDTO;
import com.alugapluscrm.model.Imovel;
import com.alugapluscrm.model.Predio;
import com.alugapluscrm.model.enums.ImovelStatus;
import com.alugapluscrm.repository.ImovelRepository;
import com.alugapluscrm.repository.PredioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ImovelService {

    private final ImovelRepository imovelRepository;
    private final PredioRepository predioRepository;

    @Cacheable(value = "imoveis")
    public Page<ImovelDTO> listar(Pageable pageable) {
        return imovelRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "imovel", key = "#p0")
    public ImovelDTO buscar(Long id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = {"imoveis", "imovel"}, allEntries = true)
    public ImovelDTO criar(ImovelDTO dto) {
        Imovel imovel = new Imovel();
        atualizarEntidade(imovel, dto);
        return toDto(imovelRepository.save(imovel));
    }

    @Transactional
    @CacheEvict(value = {"imoveis", "imovel"}, allEntries = true)
    public ImovelDTO atualizar(Long id, ImovelDTO dto) {
        Imovel imovel = buscarEntidade(id);
        atualizarEntidade(imovel, dto);
        return toDto(imovelRepository.save(imovel));
    }

    @Transactional
    @CacheEvict(value = {"imoveis", "imovel"}, allEntries = true)
    public void remover(Long id) {
        imovelRepository.deleteById(id);
    }

    private Imovel buscarEntidade(Long id) {
        return imovelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Imovel nao encontrado"));
    }

    private void atualizarEntidade(Imovel imovel, ImovelDTO dto) {
        imovel.setEndereco(dto.endereco());
        imovel.setTipo(dto.tipo());
        imovel.setValorAluguel(dto.valorAluguel());
        imovel.setStatus(dto.status() != null ? dto.status() : ImovelStatus.DISPONIVEL);
        imovel.setDescricao(dto.descricao());
        imovel.setFotoCapa(dto.fotoCapa());
        if (imovel.getDataCadastro() == null) {
            imovel.setDataCadastro(dto.dataCadastro() != null ? dto.dataCadastro() : LocalDate.now());
        } else if (dto.dataCadastro() != null) {
            imovel.setDataCadastro(dto.dataCadastro());
        }
        Predio predio = null;
        if (dto.predioId() != null) {
            predio = predioRepository.findById(dto.predioId())
                    .orElseThrow(() -> new IllegalArgumentException("Predio nao encontrado"));
        }
        imovel.setPredio(predio);
    }

    private ImovelDTO toDto(Imovel imovel) {
        Long predioId = imovel.getPredio() != null ? imovel.getPredio().getId() : null;
        return new ImovelDTO(
                imovel.getId(),
                imovel.getEndereco(),
                imovel.getTipo(),
                imovel.getValorAluguel(),
                imovel.getStatus(),
                imovel.getDescricao(),
                imovel.getFotoCapa(),
                imovel.getDataCadastro(),
                predioId
        );
    }
}
