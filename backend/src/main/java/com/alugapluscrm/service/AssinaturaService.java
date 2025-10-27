package com.alugapluscrm.service;

import com.alugapluscrm.dto.AssinaturaCheckoutResponse;
import com.alugapluscrm.dto.AssinaturaDTO;
import com.alugapluscrm.dto.AssinaturaRequest;
import com.alugapluscrm.dto.PixCheckoutResponse;
import com.alugapluscrm.model.Assinatura;
import com.alugapluscrm.model.Plano;
import com.alugapluscrm.model.Usuario;
import com.alugapluscrm.model.enums.AssinaturaStatus;
import com.alugapluscrm.model.enums.FormaPagamento;
import com.alugapluscrm.repository.AssinaturaRepository;
import com.alugapluscrm.repository.ContratoRepository;
import com.alugapluscrm.repository.ImovelRepository;
import com.alugapluscrm.repository.PlanoRepository;
import com.alugapluscrm.tenant.TenantContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssinaturaService {

    private static final List<AssinaturaStatus> STATUS_ATIVOS = List.of(
            AssinaturaStatus.ATIVA,
            AssinaturaStatus.AGUARDANDO_PAGAMENTO
    );

    private final AssinaturaRepository assinaturaRepository;
    private final PlanoRepository planoRepository;
    private final UsuarioService usuarioService;
    private final PixCheckoutService pixCheckoutService;
    private final ImovelRepository imovelRepository;
    private final ContratoRepository contratoRepository;

    @Cacheable(value = "assinaturas", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<AssinaturaDTO> listarTodas(Pageable pageable) {
        return assinaturaRepository.findAll(pageable).map(this::toDto);
    }

    public AssinaturaDTO buscarPorId(Long id) {
        return toDto(assinaturaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assinatura não encontrada.")));
    }

    public Optional<AssinaturaDTO> assinaturaAtualDoUsuario() {
        Usuario usuario = usuarioService.obterUsuarioAutenticado();
        return assinaturaRepository.findFirstByUsuarioAndStatusIn(usuario, STATUS_ATIVOS)
                .map(this::toDto);
    }

    public Optional<Assinatura> assinaturaAtivaTenant() {
        String tenantId = TenantContext.getTenantId();
        return assinaturaRepository.findFirstByTenantIdAndStatusIn(tenantId, STATUS_ATIVOS);
    }

    @Transactional
    @CacheEvict(value = "assinaturas", allEntries = true)
    public AssinaturaCheckoutResponse criar(AssinaturaRequest request) {
        Usuario usuario = usuarioService.obterUsuarioAutenticado();
        Plano plano = planoRepository.findById(request.planoId())
                .orElseThrow(() -> new IllegalArgumentException("Plano informado não existe."));
        if (!Boolean.TRUE.equals(plano.getAtivo())) {
            throw new IllegalStateException("Plano inativo. Escolha outro plano.");
        }
        if (assinaturaRepository.existsByUsuarioAndStatusIn(usuario, STATUS_ATIVOS)) {
            throw new IllegalStateException("Já existe uma assinatura ativa ou pendente para este usuário.");
        }

        Assinatura assinatura = Assinatura.builder()
                .usuario(usuario)
                .plano(plano)
                .dataInicio(LocalDate.now())
                .status(AssinaturaStatus.AGUARDANDO_PAGAMENTO)
                .formaPagamento(request.formaPagamento())
                .tenantId(TenantContext.getTenantId())
                .build();

        assinatura = assinaturaRepository.save(assinatura);

        PixCheckoutResponse pix = null;
        if (request.formaPagamento() == FormaPagamento.PIX) {
            pix = pixCheckoutService.gerarChavePix(assinatura, plano.getValorMensal(), plano.getNome());
            assinatura.setChavePix(pix.chavePix());
            assinaturaRepository.save(assinatura);
        }

        return new AssinaturaCheckoutResponse(toDto(assinatura), pix);
    }

    @Transactional
    @CacheEvict(value = "assinaturas", allEntries = true)
    public AssinaturaDTO cancelar(Long id) {
        Usuario usuario = usuarioService.obterUsuarioAutenticado();
        Assinatura assinatura = assinaturaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assinatura não encontrada."));
        if (!assinatura.getUsuario().getId().equals(usuario.getId())
                && usuario.getRole() != com.alugapluscrm.model.enums.UserRole.ADMIN) {
            throw new SecurityException("Você não possui permissão para cancelar esta assinatura.");
        }
        assinatura.setStatus(AssinaturaStatus.CANCELADA);
        assinatura.setDataFim(LocalDate.now());
        assinaturaRepository.save(assinatura);
        return toDto(assinatura);
    }

    public void validarLimiteImoveis(long totalImoveis) {
        assinaturaAtivaTenant().ifPresent(assinatura -> {
            Plano plano = assinatura.getPlano();
            Integer limite = plano.getQtdeImoveis();
            if (limite != null && totalImoveis >= limite) {
                throw new IllegalStateException("Limite de imóveis do plano foi atingido.");
            }
        });
    }

    public void validarLimiteContratos(long totalContratos) {
        assinaturaAtivaTenant().ifPresent(assinatura -> {
            Plano plano = assinatura.getPlano();
            Integer limite = plano.getQtdeContratos();
            if (limite != null && totalContratos >= limite) {
                throw new IllegalStateException("Limite de contratos do plano foi atingido.");
            }
        });
    }

    public long totalImoveisTenant() {
        return imovelRepository.countByTenantId(TenantContext.getTenantId());
    }

    public long totalContratosTenant() {
        return contratoRepository.countByTenantId(TenantContext.getTenantId());
    }

    private AssinaturaDTO toDto(Assinatura assinatura) {
        return new AssinaturaDTO(
                assinatura.getId(),
                assinatura.getUsuario().getId(),
                assinatura.getPlano().getId(),
                assinatura.getPlano().getNome(),
                assinatura.getDataInicio(),
                assinatura.getDataFim(),
                assinatura.getStatus(),
                assinatura.getFormaPagamento(),
                assinatura.getChavePix(),
                assinatura.getTransacaoId()
        );
    }
}
