package com.alugapluscrm.service;

import com.alugapluscrm.dto.ContratoDTO;
import com.alugapluscrm.model.Contrato;
import com.alugapluscrm.model.Imovel;
import com.alugapluscrm.model.Inquilino;
import com.alugapluscrm.model.enums.ContratoStatus;
import com.alugapluscrm.model.enums.ImovelStatus;
import com.alugapluscrm.repository.ContratoRepository;
import com.alugapluscrm.repository.ImovelRepository;
import com.alugapluscrm.repository.InquilinoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContratoService {

    private final ContratoRepository contratoRepository;
    private final ImovelRepository imovelRepository;
    private final InquilinoRepository inquilinoRepository;
    private final NotificacaoService notificacaoService;

    @Cacheable(value = "contratos")
    public Page<ContratoDTO> listar(Pageable pageable) {
        return contratoRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "contrato", key = "#id")
    public ContratoDTO buscar(Long id) {
        return toDto(buscarEntidade(id));
    }

    public java.util.List<ContratoDTO> listarPorInquilino(Long inquilinoId) {
        Inquilino inquilino = inquilinoRepository.findById(inquilinoId)
                .orElseThrow(() -> new IllegalArgumentException("Inquilino nao encontrado"));
        return contratoRepository.findByInquilino(inquilino)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    @CacheEvict(value = {"contratos", "contrato", "imovel"}, allEntries = true)
    public ContratoDTO criar(ContratoDTO dto) {
        Contrato contrato = new Contrato();
        atualizarEntidade(contrato, dto);
        Contrato salvo = contratoRepository.save(contrato);
        atualizarStatusImovel(contrato.getImovel(), contrato.getStatus());
        verificarRenovacao(salvo);
        return toDto(salvo);
    }

    @Transactional
    @CacheEvict(value = {"contratos", "contrato", "imovel"}, allEntries = true)
    public ContratoDTO atualizar(Long id, ContratoDTO dto) {
        Contrato contrato = buscarEntidade(id);
        atualizarEntidade(contrato, dto);
        Contrato salvo = contratoRepository.save(contrato);
        atualizarStatusImovel(contrato.getImovel(), contrato.getStatus());
        verificarRenovacao(salvo);
        return toDto(salvo);
    }

    @Transactional
    @CacheEvict(value = {"contratos", "contrato", "imovel"}, allEntries = true)
    public void remover(Long id) {
        Contrato contrato = buscarEntidade(id);
        contratoRepository.delete(contrato);
        atualizarStatusImovel(contrato.getImovel(), ContratoStatus.ENCERRADO);
    }

    @Transactional
    @CacheEvict(value = {"contratos", "contrato"}, allEntries = true)
    public ContratoDTO atualizarArquivo(Long id, String arquivoPath, String hashDocumento) {
        Contrato contrato = buscarEntidade(id);
        contrato.setArquivoPdf(arquivoPath);
        contrato.setHashDocumento(hashDocumento);
        contrato.setDataUpload(LocalDateTime.now());
        Contrato salvo = contratoRepository.save(contrato);
        verificarRenovacao(salvo);
        return toDto(salvo);
    }

    private Contrato buscarEntidade(Long id) {
        return contratoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contrato nao encontrado"));
    }

    private void atualizarEntidade(Contrato contrato, ContratoDTO dto) {
        Imovel imovel = imovelRepository.findById(dto.imovelId())
                .orElseThrow(() -> new IllegalArgumentException("Imovel nao encontrado para contrato"));
        Inquilino inquilino = inquilinoRepository.findById(dto.inquilinoId())
                .orElseThrow(() -> new IllegalArgumentException("Inquilino nao encontrado para contrato"));
        contrato.setImovel(imovel);
        contrato.setInquilino(inquilino);
        contrato.setDataInicio(dto.dataInicio());
        contrato.setDataFim(dto.dataFim());
        contrato.setValorMensal(dto.valorMensal());
        contrato.setStatus(dto.status() != null ? dto.status() : ContratoStatus.PENDENTE);
        contrato.setArquivoPdf(dto.arquivoPdf());
        contrato.setHashDocumento(dto.hashDocumento());
        contrato.setObservacao(dto.observacao());
        contrato.setDataUpload(dto.dataUpload() != null ? dto.dataUpload() : LocalDateTime.now());
    }

    private void atualizarStatusImovel(Imovel imovel, ContratoStatus status) {
        if (imovel == null) {
            return;
        }
        ImovelStatus novoStatus = switch (status) {
            case ATIVO -> ImovelStatus.ALUGADO;
            case RESCINDIDO, ENCERRADO -> ImovelStatus.DISPONIVEL;
            default -> imovel.getStatus();
        };
        imovel.setStatus(novoStatus);
        imovelRepository.save(imovel);
    }

    private void verificarRenovacao(Contrato contrato) {
        if (contrato.getDataFim() == null) {
            return;
        }
        long diasRestantes = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.now(), contrato.getDataFim());
        if (diasRestantes >= 0 && diasRestantes <= 30) {
            notificacaoService.notificacaoRenovacaoContrato(contrato);
        }
    }

    private ContratoDTO toDto(Contrato contrato) {
        return new ContratoDTO(
                contrato.getId(),
                contrato.getImovel() != null ? contrato.getImovel().getId() : null,
                contrato.getInquilino() != null ? contrato.getInquilino().getId() : null,
                contrato.getDataInicio(),
                contrato.getDataFim(),
                contrato.getValorMensal(),
                contrato.getStatus(),
                contrato.getArquivoPdf(),
                contrato.getHashDocumento(),
                contrato.getDataUpload(),
                contrato.getObservacao()
        );
    }
}
