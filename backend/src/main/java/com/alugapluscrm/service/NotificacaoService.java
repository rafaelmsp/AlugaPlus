package com.alugapluscrm.service;

import com.alugapluscrm.model.Contrato;
import com.alugapluscrm.model.Pagamento;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private static final Logger logger = LoggerFactory.getLogger(NotificacaoService.class);

    private final JavaMailSender mailSender;

    public void notificacaoVencimento(Pagamento pagamento) {
        if (pagamento.getContrato() == null) {
            return;
        }
        String destinatario = pagamento.getContrato().getInquilino().getEmail();
        String assunto = "Aviso de vencimento de aluguel";
        String mensagem = String.format(
                "O pagamento do contrato #%d vence em %s no valor de %s.",
                pagamento.getContrato().getId(),
                pagamento.getDataVencimento(),
                pagamento.getValor()
        );
        enviarEmail(destinatario, assunto, mensagem);
    }

    public void notificacaoAtraso(Pagamento pagamento) {
        if (pagamento.getContrato() == null) {
            return;
        }
        String destinatario = pagamento.getContrato().getInquilino().getEmail();
        String assunto = "Pagamento em atraso";
        String mensagem = String.format(
                "O pagamento do contrato #%d referente a %s esta atrasado. Valor devido: %s.",
                pagamento.getContrato().getId(),
                pagamento.getDataVencimento(),
                pagamento.getValor()
        );
        enviarEmail(destinatario, assunto, mensagem);
    }

    public void notificacaoRenovacaoContrato(Contrato contrato) {
        if (contrato.getDataFim() == null || contrato.getInquilino() == null) {
            return;
        }
        long diasRestantes = ChronoUnit.DAYS.between(LocalDate.now(), contrato.getDataFim());
        if (diasRestantes < 0) {
            return;
        }
        String destinatario = contrato.getInquilino().getEmail();
        String assunto = "Renovacao de contrato";
        String mensagem = String.format(
                "Seu contrato #%d vence em %s. Restam %d dias para renovacao.",
                contrato.getId(),
                contrato.getDataFim(),
                diasRestantes
        );
        enviarEmail(destinatario, assunto, mensagem);
    }

    private void enviarEmail(String destinatario, String assunto, String mensagem) {
        try {
            MimeMessage mail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, true);
            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(mensagem, false);
            helper.setFrom("no-reply@alugaplus.com");
            mailSender.send(mail);
            logger.info("Notificacao enviada para {}", destinatario);
        } catch (MessagingException | RuntimeException ex) {
            logger.warn("Falha ao enviar email para {}: {}", destinatario, ex.getMessage());
        }
    }
}
