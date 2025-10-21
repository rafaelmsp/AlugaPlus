<div align="center" style="font-family:'Poppins',sans-serif;background:radial-gradient(circle at top,#0a0a1f 0%,#000010 80%);color:#e0e0e0;padding:40px;border-radius:20px;box-shadow:0 0 40px #00b7ff80;margin:20px auto;max-width:1000px;">

  <!-- 🔷 CABEÇALHO -->
  <img src="https://cdn-icons-png.flaticon.com/512/826/826070.png" width="90" alt="Logo" style="filter:drop-shadow(0 0 10px #00b7ff);margin-bottom:10px;">
  <h1 style="color:#00b7ff;font-family:'Audiowide',sans-serif;font-size:2.4em;letter-spacing:1px;">🏢 AlugaPlus CRM Pro</h1>
  <p style="color:#9ca3af;font-size:1.1em;">💡 Sistema de Gestão Imobiliária Inteligente</p>
  <p><b>Tecnologias:</b> Spring Boot • Angular • PostgreSQL • TailwindCSS • JWT • Mercado Pago (PIX)</p>

  <hr style="border:0;height:1px;background:linear-gradient(90deg,transparent,#00b7ff,transparent);margin:25px 0;">

  <!-- 🔹 SOBRE -->
  <h2 style="color:#00b7ff;">📘 Sobre o Projeto</h2>
  <p align="justify" style="max-width:850px;">
    O <b>AlugaPlus CRM Pro</b> é uma plataforma completa de <b>gestão imobiliária</b> desenvolvida para automatizar o controle de <b>imóveis, contratos, inquilinos, pagamentos e vistorias</b>.  
    Oferece integração com <b>pagamentos via PIX (Mercado Pago API)</b>, geração de relatórios financeiros, e uma interface moderna e responsiva em tema <b>dark neon corporativo</b>.
  </p>

  <!-- 🔹 FUNCIONALIDADES -->
  <h2 style="color:#00b7ff;">🚀 Funcionalidades Principais</h2>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:15px;max-width:850px;">
    <div style="background:#111827;padding:15px 20px;border-radius:12px;flex:1 1 300px;text-align:left;box-shadow:0 0 10px #00b7ff20;">
      <b>🔐 Autenticação JWT</b><br>Controle de acesso com perfis (ADMIN, GESTOR, INQUILINO).
    </div>
    <div style="background:#111827;padding:15px 20px;border-radius:12px;flex:1 1 300px;text-align:left;box-shadow:0 0 10px #00b7ff20;">
      <b>🏠 Gestão de Imóveis</b><br>CRUD completo com fotos, status e integração com contratos.
    </div>
    <div style="background:#111827;padding:15px 20px;border-radius:12px;flex:1 1 300px;text-align:left;box-shadow:0 0 10px #00b7ff20;">
      <b>💰 Financeiro Integrado</b><br>Controle de receitas/despesas e pagamentos via PIX dinâmico.
    </div>
    <div style="background:#111827;padding:15px 20px;border-radius:12px;flex:1 1 300px;text-align:left;box-shadow:0 0 10px #00b7ff20;">
      <b>📑 Contratos e PDFs</b><br>Upload seguro com hash SHA-256 e validação.
    </div>
    <div style="background:#111827;padding:15px 20px;border-radius:12px;flex:1 1 300px;text-align:left;box-shadow:0 0 10px #00b7ff20;">
      <b>🧾 Vistorias e Fotos</b><br>Registro completo de entrada, saída e manutenção.
    </div>
    <div style="background:#111827;padding:15px 20px;border-radius:12px;flex:1 1 300px;text-align:left;box-shadow:0 0 10px #00b7ff20;">
      <b>📊 Relatórios e Dashboard</b><br>Indicadores e gráficos interativos com Chart.js.
    </div>
  </div>

  <hr style="border:0;height:1px;background:linear-gradient(90deg,transparent,#00b7ff,transparent);margin:35px 0;">

  <!-- 🔹 ARQUITETURA -->
  <h2 style="color:#00b7ff;">🧠 Arquitetura do Sistema</h2>
  <pre style="text-align:left;background:#111827;padding:15px 20px;border-radius:10px;color:#93c5fd;max-width:850px;">
Frontend (Angular)
   │
   ├── Serviços REST (HTTPClient)
   │
Backend (Spring Boot)
   │
   ├── Controllers → Services → Repositories
   │
Banco de Dados (PostgreSQL)
  </pre>

  <!-- 🔹 TECNOLOGIAS -->
  <h2 style="color:#00b7ff;">⚙️ Tecnologias Utilizadas</h2>
  <table align="center" style="border-collapse:collapse;margin:auto;color:#e5e7eb;max-width:700px;">
    <tr style="background:#111827;"><th align="left" style="padding:8px;">Camada</th><th align="left" style="padding:8px;">Tecnologia</th></tr>
    <tr><td style="padding:6px;">Frontend</td><td>Angular 17, TailwindCSS, Chart.js</td></tr>
    <tr style="background:#111827;"><td style="padding:6px;">Backend</td><td>Spring Boot 3, Java 17, Spring Security, WebFlux</td></tr>
    <tr><td style="padding:6px;">Banco</td><td>PostgreSQL</td></tr>
    <tr style="background:#111827;"><td style="padding:6px;">Pagamentos</td><td>Mercado Pago API (PIX)</td></tr>
    <tr><td style="padding:6px;">Relatórios</td><td>iTextPDF, Apache POI</td></tr>
  </table>

  <!-- 🔹 INSTALAÇÃO -->
  <h2 style="color:#00b7ff;">💻 Instalação e Execução</h2>

  <h3 style="color:#38bdf8;">🧩 Backend</h3>
  <pre style="background:#111827;padding:10px 20px;border-radius:10px;text-align:left;color:#d1d5db;">git clone https://github.com/rafaelmsp/alugaplus-backend.git
cd alugaplus-backend
mvn spring-boot:run</pre>

  <h3 style="color:#38bdf8;">🌐 Frontend</h3>
  <pre style="background:#111827;padding:10px 20px;border-radius:10px;text-align:left;color:#d1d5db;">git clone https://github.com/rafaelmsp/alugaplus-frontend.git
cd alugaplus-frontend
npm install
ng serve --open</pre>

  <h3 style="color:#38bdf8;">🗃️ Banco de Dados</h3>
  <pre style="background:#111827;padding:10px 20px;border-radius:10px;text-align:left;color:#d1d5db;">CREATE DATABASE alugaplus;

# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/alugaplus
    username: postgres
    password: postgres</pre>

  <!-- 🔹 PIX -->
  <h2 style="color:#00b7ff;">💸 Integração PIX (Mercado Pago)</h2>
  <p align="justify" style="max-width:850px;">
    O sistema gera <b>QR Codes PIX dinâmicos</b> com valor e descrição automática.  
    Após o pagamento, o Mercado Pago envia um <b>webhook</b> ao backend, atualizando o status do contrato em tempo real.
  </p>
  <pre style="background:#111827;padding:10px 20px;border-radius:10px;text-align:left;color:#93c5fd;">[Portal do Inquilino] → [Backend: gerar cobrança PIX via API]
          ↓
QR Code exibido ao inquilino
          ↓
Pagamento via app bancário
          ↓
Mercado Pago envia Webhook
          ↓
[Backend atualiza status no contrato]</pre>

  <!-- 🔹 EXPANSÕES -->
  <h2 style="color:#00b7ff;">🔮 Futuras Expansões</h2>
  <ul style="text-align:left;display:inline-block;max-width:850px;">
    <li>📱 App mobile (Ionic / Flutter)</li>
    <li>🧠 OCR de contratos (Tesseract)</li>
    <li>✍️ Assinatura digital com DocuSign</li>
    <li>👥 Múltiplos proprietários e imobiliárias</li>
    <li>📈 Dashboard com IA para rentabilidade</li>
  </ul>

  <hr style="border:0;height:1px;background:linear-gradient(90deg,transparent,#00b7ff,transparent);margin:35px 0;">

  <!-- 🔹 AUTOR -->
  <h2 style="color:#00b7ff;">👨‍💻 Autor</h2>
  <p><b>Rafael Moraes da Silva Passos</b></p>
  <p>
    Engenheiro de Software | Bacharel em Sistemas de Informação<br>
    Pós-graduado em Engenharia de Software, Cibersegurança e Gestão de Projetos
  </p>
  <p>
    🔗 <a href="https://linkedin.com/in/rafael-passos-023648144" target="_blank" style="color:#38bdf8;">LinkedIn</a> |
    🐙 <a href="https://github.com/rafaelmsp" target="_blank" style="color:#38bdf8;">GitHub</a> |
    ✉️ <a href="mailto:rafael.passos.dev@gmail.com" style="color:#38bdf8;">E-mail</a>
  </p>

  <hr style="border:0;height:1px;background:linear-gradient(90deg,transparent,#00b7ff,transparent);margin:25px 0;">

  <p style="font-size:12px;color:#9ca3af;">
    © 2025 <b>AlugaPlus CRM Pro</b> — Desenvolvido por Rafael Moraes da Silva Passos.<br>
    Licença MIT — uso livre com créditos ao autor.
  </p>
</div>
