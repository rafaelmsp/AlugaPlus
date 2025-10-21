package com.alugapluscrm.service;

import com.alugapluscrm.dto.ContaPredioDTO;
import com.alugapluscrm.model.ContaPredio;
import com.alugapluscrm.model.Predio;
import com.alugapluscrm.model.enums.ContaPredioStatus;
import com.alugapluscrm.repository.ContaPredioRepository;
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
public class ContaPredioService {

    private final ContaPredioRepository contaPredioRepository;
    private final PredioRepository predioRepository;
    private final MovimentacaoFinanceiraService movimentacaoFinanceiraService;

    @Cacheable(value = "contasPredio")
    public Page<ContaPredioDTO> listar(Pageable pageable) {
        return contaPredioRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "contaPredio", key = "#id")
    public ContaPredioDTO buscar(Long id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = {"contasPredio", "contaPredio"}, allEntries = true)
    public ContaPredioDTO criar(ContaPredioDTO dto) {
        ContaPredio conta = new ContaPredio();
        atualizarEntidade(conta, dto);
        ContaPredio salvo = contaPredioRepository.save(conta);
        movimentacaoFinanceiraService.registrarDespesaContaPredio(salvo);
        return toDto(salvo);
    }

    @Transactional
    @CacheEvict(value = {"contasPredio", "contaPredio"}, allEntries = true)
    public ContaPredioDTO atualizar(Long id, ContaPredioDTO dto) {
        ContaPredio conta = buscarEntidade(id);
        atualizarEntidade(conta, dto);
        ContaPredio salvo = contaPredioRepository.save(conta);
        movimentacaoFinanceiraService.registrarDespesaContaPredio(salvo);
        return toDto(salvo);
    }

    @Transactional
    @CacheEvict(value = {"contasPredio", "contaPredio"}, allEntries = true)
    public void remover(Long id) {
        ContaPredio conta = buscarEntidade(id);
        contaPredioRepository.delete(conta);
        movimentacaoFinanceiraService.removerPorReferencia("CONTA_PREDIO:" + conta.getId());
    }

    private ContaPredio buscarEntidade(Long id) {
        return contaPredioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Conta de predio nao encontrada"));
    }

    private void atualizarEntidade(ContaPredio conta, ContaPredioDTO dto) {
        Predio predio = predioRepository.findById(dto.predioId())
                .orElseThrow(() -> new IllegalArgumentException("Predio nao encontrado para conta"));
        conta.setPredio(predio);
        conta.setTipo(dto.tipo());
        conta.setValor(dto.valor());
        conta.setMesReferencia(dto.mesReferencia());
        conta.setAnoReferencia(dto.anoReferencia());
        conta.setVencimento(dto.vencimento());
        conta.setDataPagamento(dto.dataPagamento());
        conta.setComprovante(dto.comprovante());
        conta.setStatus(dto.status() != null ? dto.status() : ContaPredioStatus.PENDENTE);
        conta.setRecorrente(dto.recorrente());
        conta.setObservacao(dto.observacao());
    }

    private ContaPredioDTO toDto(ContaPredio conta) {
        return new ContaPredioDTO(
                conta.getId(),
                conta.getPredio() != null ? conta.getPredio().getId() : null,
                conta.getTipo(),
                conta.getValor(),
                conta.getMesReferencia(),
                conta.getAnoReferencia(),
                conta.getVencimento(),
                conta.getDataPagamento(),
                conta.getComprovante(),
                conta.getStatus(),
                conta.isRecorrente(),
                conta.getObservacao()
        );
    }
}
