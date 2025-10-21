package com.alugapluscrm.service;

import com.alugapluscrm.dto.ManutencaoDTO;
import com.alugapluscrm.model.Contrato;
import com.alugapluscrm.model.Imovel;
import com.alugapluscrm.model.Manutencao;
import com.alugapluscrm.model.enums.ManutencaoStatus;
import com.alugapluscrm.repository.ContratoRepository;
import com.alugapluscrm.repository.ImovelRepository;
import com.alugapluscrm.repository.ManutencaoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ManutencaoService {

    private final ManutencaoRepository manutencaoRepository;
    private final ImovelRepository imovelRepository;
    private final ContratoRepository contratoRepository;
    private final MovimentacaoFinanceiraService movimentacaoFinanceiraService;

    @Cacheable(value = "manutencoes")
    public Page<ManutencaoDTO> listar(Pageable pageable) {
        return manutencaoRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "manutencao", key = "#id")
    public ManutencaoDTO buscar(Long id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = {"manutencoes", "manutencao"}, allEntries = true)
    public ManutencaoDTO criar(ManutencaoDTO dto) {
        Manutencao manutencao = new Manutencao();
        atualizarEntidade(manutencao, dto);
        Manutencao salvo = manutencaoRepository.save(manutencao);
        if (salvo.getCusto() != null && salvo.getCusto().signum() > 0) {
            movimentacaoFinanceiraService.registrarDespesaManutencao(salvo);
        }
        return toDto(salvo);
    }

    @Transactional
    @CacheEvict(value = {"manutencoes", "manutencao"}, allEntries = true)
    public ManutencaoDTO atualizar(Long id, ManutencaoDTO dto) {
        Manutencao manutencao = buscarEntidade(id);
        atualizarEntidade(manutencao, dto);
        Manutencao salvo = manutencaoRepository.save(manutencao);
        if (salvo.getCusto() != null && salvo.getCusto().signum() > 0) {
            movimentacaoFinanceiraService.registrarDespesaManutencao(salvo);
        } else {
            movimentacaoFinanceiraService.removerPorReferencia("MANUTENCAO:" + salvo.getId());
        }
        return toDto(salvo);
    }

    @Transactional
    @CacheEvict(value = {"manutencoes", "manutencao"}, allEntries = true)
    public void remover(Long id) {
        Manutencao manutencao = buscarEntidade(id);
        manutencaoRepository.delete(manutencao);
        movimentacaoFinanceiraService.removerPorReferencia("MANUTENCAO:" + manutencao.getId());
    }

    @Transactional
    @CacheEvict(value = {"manutencoes", "manutencao"}, allEntries = true)
    public ManutencaoDTO atualizarFotos(Long id, java.util.List<String> fotos) {
        Manutencao manutencao = buscarEntidade(id);
        manutencao.setFotos(fotos != null ? new java.util.ArrayList<>(fotos) : new java.util.ArrayList<>());
        Manutencao salvo = manutencaoRepository.save(manutencao);
        return toDto(salvo);
    }

    private Manutencao buscarEntidade(Long id) {
        return manutencaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Manutencao nao encontrada"));
    }

    private void atualizarEntidade(Manutencao manutencao, ManutencaoDTO dto) {
        Imovel imovel = imovelRepository.findById(dto.imovelId())
                .orElseThrow(() -> new IllegalArgumentException("Imovel nao encontrado para manutencao"));
        manutencao.setImovel(imovel);
        if (dto.contratoId() != null) {
            Contrato contrato = contratoRepository.findById(dto.contratoId())
                    .orElseThrow(() -> new IllegalArgumentException("Contrato nao encontrado para manutencao"));
            manutencao.setContrato(contrato);
        } else {
            manutencao.setContrato(null);
        }
        manutencao.setDataSolicitacao(dto.dataSolicitacao());
        manutencao.setDescricao(dto.descricao());
        manutencao.setResponsavel(dto.responsavel());
        manutencao.setCusto(dto.custo());
        manutencao.setStatus(dto.status() != null ? dto.status() : ManutencaoStatus.PENDENTE);
        manutencao.setFotos(dto.fotos() != null ? new java.util.ArrayList<>(dto.fotos()) : new java.util.ArrayList<>());
    }

    private ManutencaoDTO toDto(Manutencao manutencao) {
        return new ManutencaoDTO(
                manutencao.getId(),
                manutencao.getImovel() != null ? manutencao.getImovel().getId() : null,
                manutencao.getContrato() != null ? manutencao.getContrato().getId() : null,
                manutencao.getDataSolicitacao(),
                manutencao.getDescricao(),
                manutencao.getResponsavel(),
                manutencao.getCusto(),
                manutencao.getStatus(),
                manutencao.getFotos()
        );
    }
}
