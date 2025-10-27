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
import com.alugapluscrm.storage.FileStorageService;
import com.alugapluscrm.tenant.TenantContext;
import com.alugapluscrm.util.HashUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContratoService {

    private final ContratoRepository contratoRepository;
    private final ImovelRepository imovelRepository;
    private final InquilinoRepository inquilinoRepository;
    private final NotificacaoService notificacaoService;
    private final FileStorageService fileStorageService;

    @Cacheable(
            value = "contratos",
            key = "T(com.alugapluscrm.tenant.TenantContext).cacheKey(#pageable != null ? #pageable.toString() : 'all')"
    )
    public Page<ContratoDTO> listar(Pageable pageable) {
        return contratoRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "contrato", key = "T(com.alugapluscrm.tenant.TenantContext).cacheKey(#id)")
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
        contrato.setTenantId(TenantContext.getTenantId());
        Contrato salvo = contratoRepository.save(contrato);
        atualizarStatusImovel(contrato.getImovel(), contrato.getStatus());
        verificarRenovacao(salvo);
        return toDto(salvo);
    }

    @Transactional
    @CacheEvict(value = {"contratos", "contrato", "imovel"}, allEntries = true)
    public ContratoDTO criarComArquivo(ContratoDTO dto, MultipartFile arquivo) {
        Contrato contrato = new Contrato();
        atualizarEntidade(contrato, dto);
        contrato.setTenantId(TenantContext.getTenantId());
        anexarArquivo(contrato, arquivo);
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
    public ContratoDTO atualizarArquivo(Long id, MultipartFile arquivo) {
        Contrato contrato = buscarEntidade(id);
        anexarArquivo(contrato, arquivo);
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

    private void anexarArquivo(Contrato contrato, MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            return;
        }
        try {
            String caminhoArquivo = fileStorageService.storeContrato(arquivo);
            String hash = HashUtil.sha256(arquivo.getInputStream());
            contrato.setArquivoPdf(caminhoArquivo);
            contrato.setHashDocumento(hash);
            contrato.setDataUpload(LocalDateTime.now());
        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar arquivo de contrato", e);
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
                contrato.getObservacao(),
                contrato.getImovel() != null ? contrato.getImovel().getEndereco() : null,
                contrato.getInquilino() != null ? contrato.getInquilino().getNome() : null
        );
    }
}
