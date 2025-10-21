package com.alugapluscrm.service;

import com.alugapluscrm.dto.MovimentacaoFinanceiraDTO;
import com.alugapluscrm.model.*;
import com.alugapluscrm.model.enums.FormaPagamento;
import com.alugapluscrm.model.enums.MovimentacaoStatus;
import com.alugapluscrm.model.enums.MovimentacaoTipo;
import com.alugapluscrm.repository.ContratoRepository;
import com.alugapluscrm.repository.ImovelRepository;
import com.alugapluscrm.repository.MovimentacaoFinanceiraRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MovimentacaoFinanceiraService {

    private final MovimentacaoFinanceiraRepository movimentacaoFinanceiraRepository;
    private final ImovelRepository imovelRepository;
    private final ContratoRepository contratoRepository;

    @Cacheable(value = "movimentacoes")
    public Page<MovimentacaoFinanceiraDTO> listar(Pageable pageable) {
        return movimentacaoFinanceiraRepository.findAll(pageable).map(this::toDto);
    }

    @Cacheable(value = "movimentacao", key = "#id")
    public MovimentacaoFinanceiraDTO buscar(Long id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = {"movimentacoes", "movimentacao"}, allEntries = true)
    public MovimentacaoFinanceiraDTO criar(MovimentacaoFinanceiraDTO dto) {
        MovimentacaoFinanceira movimentacao = new MovimentacaoFinanceira();
        atualizarEntidade(movimentacao, dto);
        return toDto(movimentacaoFinanceiraRepository.save(movimentacao));
    }

    @Transactional
    @CacheEvict(value = {"movimentacoes", "movimentacao"}, allEntries = true)
    public MovimentacaoFinanceiraDTO atualizar(Long id, MovimentacaoFinanceiraDTO dto) {
        MovimentacaoFinanceira movimentacao = buscarEntidade(id);
        atualizarEntidade(movimentacao, dto);
        return toDto(movimentacaoFinanceiraRepository.save(movimentacao));
    }

    @Transactional
    @CacheEvict(value = {"movimentacoes", "movimentacao"}, allEntries = true)
    public void remover(Long id) {
        movimentacaoFinanceiraRepository.deleteById(id);
    }

    @Transactional
    @CacheEvict(value = {"movimentacoes", "movimentacao"}, allEntries = true)
    public void removerPorReferencia(String referencia) {
        movimentacaoFinanceiraRepository.findByReferencia(referencia)
                .ifPresent(movimentacaoFinanceiraRepository::delete);
    }

    @Transactional
    public void registrarReceitaPagamento(Pagamento pagamento) {
        if (pagamento == null || pagamento.getContrato() == null) {
            return;
        }
        String referencia = "PAGAMENTO:" + pagamento.getId();
        MovimentacaoFinanceira movimentacao = movimentacaoFinanceiraRepository.findByReferencia(referencia)
                .orElseGet(MovimentacaoFinanceira::new);

        movimentacao.setReferencia(referencia);
        movimentacao.setTipo(MovimentacaoTipo.RECEITA);
        movimentacao.setCategoria("Receita de Aluguel");
        movimentacao.setDescricao("Pagamento contrato #" + pagamento.getContrato().getId());
        movimentacao.setValor(pagamento.getValor());
        movimentacao.setData(Optional.ofNullable(pagamento.getDataPagamento()).orElse(LocalDate.now()));
        movimentacao.setContrato(pagamento.getContrato());
        movimentacao.setImovel(pagamento.getContrato().getImovel());
        movimentacao.setComprovante(pagamento.getComprovante());
        movimentacao.setStatus(MovimentacaoStatus.CONFIRMADO);
        movimentacao.setFormaPagamento(pagamento.getFormaPagamento());
        movimentacaoFinanceiraRepository.save(movimentacao);
    }

    @Transactional
    public void registrarDespesaContaPredio(ContaPredio conta) {
        if (conta == null) {
            return;
        }
        String referencia = "CONTA_PREDIO:" + conta.getId();
        MovimentacaoFinanceira movimentacao = movimentacaoFinanceiraRepository.findByReferencia(referencia)
                .orElseGet(MovimentacaoFinanceira::new);

        movimentacao.setReferencia(referencia);
        movimentacao.setTipo(MovimentacaoTipo.DESPESA);
        movimentacao.setCategoria("Conta de " + conta.getTipo().name());
        movimentacao.setDescricao("Conta do predio #" + conta.getPredio().getId());
        movimentacao.setValor(conta.getValor());
        movimentacao.setData(Optional.ofNullable(conta.getDataPagamento()).orElse(LocalDate.now()));
        movimentacao.setContrato(null);
        movimentacao.setImovel(null);
        movimentacao.setComprovante(conta.getComprovante());
        movimentacao.setStatus(conta.getStatus() != null && conta.getStatus().name().equals("PAGO")
                ? MovimentacaoStatus.CONFIRMADO
                : MovimentacaoStatus.PENDENTE);
        movimentacao.setFormaPagamento(FormaPagamento.OUTRO);
        movimentacaoFinanceiraRepository.save(movimentacao);
    }

    @Transactional
    public void registrarDespesaManutencao(Manutencao manutencao) {
        if (manutencao == null) {
            return;
        }
        String referencia = "MANUTENCAO:" + manutencao.getId();
        MovimentacaoFinanceira movimentacao = movimentacaoFinanceiraRepository.findByReferencia(referencia)
                .orElseGet(MovimentacaoFinanceira::new);

        movimentacao.setReferencia(referencia);
        movimentacao.setTipo(MovimentacaoTipo.DESPESA);
        movimentacao.setCategoria("Manutencao");
        movimentacao.setDescricao("Manutencao imovel #" + manutencao.getImovel().getId());
        movimentacao.setValor(Optional.ofNullable(manutencao.getCusto()).orElseThrow(() ->
                new IllegalArgumentException("Manutencao precisa ter custo para registrar despesa")));
        movimentacao.setData(manutencao.getDataSolicitacao());
        movimentacao.setContrato(manutencao.getContrato());
        movimentacao.setImovel(manutencao.getImovel());
        movimentacao.setComprovante(null);
        movimentacao.setStatus(MovimentacaoStatus.PENDENTE);
        movimentacao.setFormaPagamento(FormaPagamento.OUTRO);
        movimentacaoFinanceiraRepository.save(movimentacao);
    }

    private MovimentacaoFinanceira buscarEntidade(Long id) {
        return movimentacaoFinanceiraRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movimentacao nao encontrada"));
    }

    private void atualizarEntidade(MovimentacaoFinanceira movimentacao, MovimentacaoFinanceiraDTO dto) {
        movimentacao.setTipo(dto.tipo());
        movimentacao.setCategoria(dto.categoria());
        movimentacao.setDescricao(dto.descricao());
        movimentacao.setValor(dto.valor());
        movimentacao.setData(dto.data());
        movimentacao.setComprovante(dto.comprovante());
        movimentacao.setStatus(dto.status() != null ? dto.status() : MovimentacaoStatus.PENDENTE);
        movimentacao.setFormaPagamento(dto.formaPagamento());
        movimentacao.setReferencia(dto.referencia());

        if (dto.imovelId() != null) {
            Imovel imovel = imovelRepository.findById(dto.imovelId())
                    .orElseThrow(() -> new IllegalArgumentException("Imovel nao encontrado para movimentacao"));
            movimentacao.setImovel(imovel);
        } else {
            movimentacao.setImovel(null);
        }

        if (dto.contratoId() != null) {
            Contrato contrato = contratoRepository.findById(dto.contratoId())
                    .orElseThrow(() -> new IllegalArgumentException("Contrato nao encontrado para movimentacao"));
            movimentacao.setContrato(contrato);
        } else {
            movimentacao.setContrato(null);
        }
    }

    private MovimentacaoFinanceiraDTO toDto(MovimentacaoFinanceira movimentacao) {
        return new MovimentacaoFinanceiraDTO(
                movimentacao.getId(),
                movimentacao.getTipo(),
                movimentacao.getCategoria(),
                movimentacao.getDescricao(),
                movimentacao.getValor(),
                movimentacao.getData(),
                movimentacao.getImovel() != null ? movimentacao.getImovel().getId() : null,
                movimentacao.getContrato() != null ? movimentacao.getContrato().getId() : null,
                movimentacao.getComprovante(),
                movimentacao.getStatus(),
                movimentacao.getFormaPagamento(),
                movimentacao.getReferencia()
        );
    }
}
