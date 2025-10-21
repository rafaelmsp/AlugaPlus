package com.alugapluscrm.service;

import com.alugapluscrm.dto.PagamentoDTO;
import com.alugapluscrm.model.Contrato;
import com.alugapluscrm.model.Pagamento;
import com.alugapluscrm.model.enums.PagamentoStatus;
import com.alugapluscrm.repository.ContratoRepository;
import com.alugapluscrm.repository.PagamentoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;
    private final ContratoRepository contratoRepository;
    private final MovimentacaoFinanceiraService movimentacaoFinanceiraService;
    private final NotificacaoService notificacaoService;

    @Cacheable(value = "pagamentos")
    public Page<PagamentoDTO> listar(Pageable pageable) {
        return pagamentoRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "pagamento", key = "#id")
    public PagamentoDTO buscar(Long id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = {"pagamentos", "pagamento"}, allEntries = true)
    public PagamentoDTO criar(PagamentoDTO dto) {
        Pagamento pagamento = new Pagamento();
        atualizarEntidade(pagamento, dto);
        Pagamento salvo = pagamentoRepository.save(pagamento);
        sincronizarMovimentacao(salvo);
        return toDto(salvo);
    }

    @Transactional
    @CacheEvict(value = {"pagamentos", "pagamento"}, allEntries = true)
    public PagamentoDTO atualizar(Long id, PagamentoDTO dto) {
        Pagamento pagamento = buscarEntidade(id);
        atualizarEntidade(pagamento, dto);
        Pagamento salvo = pagamentoRepository.save(pagamento);
        sincronizarMovimentacao(salvo);
        return toDto(salvo);
    }

    @Transactional
    @CacheEvict(value = {"pagamentos", "pagamento"}, allEntries = true)
    public void remover(Long id) {
        Pagamento pagamento = buscarEntidade(id);
        pagamentoRepository.delete(pagamento);
        movimentacaoFinanceiraService.removerPorReferencia("PAGAMENTO:" + pagamento.getId());
    }

    @Transactional
    @CacheEvict(value = {"pagamentos", "pagamento"}, allEntries = true)
    public PagamentoDTO atualizarComprovante(Long id, String comprovantePath) {
        Pagamento pagamento = buscarEntidade(id);
        pagamento.setComprovante(comprovantePath);
        Pagamento salvo = pagamentoRepository.save(pagamento);
        sincronizarMovimentacao(salvo);
        return toDto(salvo);
    }

    public java.util.List<PagamentoDTO> listarPorContrato(Long contratoId) {
        return pagamentoRepository.findByContratoId(contratoId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private Pagamento buscarEntidade(Long id) {
        return pagamentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pagamento nao encontrado"));
    }

    private void atualizarEntidade(Pagamento pagamento, PagamentoDTO dto) {
        Contrato contrato = contratoRepository.findById(dto.contratoId())
                .orElseThrow(() -> new IllegalArgumentException("Contrato nao encontrado para pagamento"));
        pagamento.setContrato(contrato);
        pagamento.setDataVencimento(dto.dataVencimento());
        pagamento.setDataPagamento(dto.dataPagamento());
        pagamento.setValor(dto.valor());
        pagamento.setStatus(dto.status() != null ? dto.status() : PagamentoStatus.PENDENTE);
        pagamento.setFormaPagamento(dto.formaPagamento());
        pagamento.setObservacao(dto.observacao());
        pagamento.setComprovante(dto.comprovante());
    }

    private void sincronizarMovimentacao(Pagamento pagamento) {
        if (pagamento.getStatus() == PagamentoStatus.PAGO) {
            movimentacaoFinanceiraService.registrarReceitaPagamento(pagamento);
        } else {
            movimentacaoFinanceiraService.removerPorReferencia("PAGAMENTO:" + pagamento.getId());
        }

        if (pagamento.getStatus() == PagamentoStatus.ATRASADO) {
            notificacaoService.notificacaoAtraso(pagamento);
        } else if (pagamento.getStatus() == PagamentoStatus.PENDENTE && pagamento.getDataVencimento() != null) {
            long dias = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.now(), pagamento.getDataVencimento());
            if (dias >= 0 && dias <= 3) {
                notificacaoService.notificacaoVencimento(pagamento);
            }
        }
    }

    private PagamentoDTO toDto(Pagamento pagamento) {
        return new PagamentoDTO(
                pagamento.getId(),
                pagamento.getContrato() != null ? pagamento.getContrato().getId() : null,
                pagamento.getDataVencimento(),
                pagamento.getDataPagamento(),
                pagamento.getValor(),
                pagamento.getStatus(),
                pagamento.getFormaPagamento(),
                pagamento.getObservacao(),
                pagamento.getComprovante()
        );
    }
}
