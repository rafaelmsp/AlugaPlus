package com.alugapluscrm.service;

import com.alugapluscrm.dto.PixCheckoutResponse;
import com.alugapluscrm.model.Assinatura;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class PixCheckoutService {

    private static final SecureRandom RANDOM = new SecureRandom();

    public PixCheckoutResponse gerarChavePix(Assinatura assinatura, BigDecimal valor, String descricao) {
        String chave = gerarToken();
        String payload = "pix://pay?key=%s&amount=%s&description=%s&assinatura=%s".formatted(
                chave,
                valor,
                descricao,
                assinatura.getId()
        );
        String qrCode = Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        return new PixCheckoutResponse(chave, qrCode, valor, descricao);
    }

    private String gerarToken() {
        byte[] bytes = new byte[24];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
