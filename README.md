# AlugaPlus CRM Pro

AlugaPlus CRM Pro é uma plataforma completa de gestão de locações voltada para administradoras imobiliárias e gestores de portfólios. O projeto combina um backend Java moderno com uma SPA Angular para entregar automação de contratos, gestão financeira, manutenção, relacionamento com inquilinos e monitoramento por relatórios — tudo com suporte multi-inquilino para operar múltiplos clientes na mesma instância.

## Visão geral da solução

| Camada | Tecnologia | Descrição |
| ------ | ---------- | --------- |
| Backend | [Spring Boot 3](backend/pom.xml) / Java 17 | API REST multi-inquilino com autenticação JWT, cache, envio de e-mails e geração de PDFs/planilhas. |
| Frontend | [Angular 17](frontend/package.json) + TailwindCSS | Interface responsiva com módulos administrativos, portal do inquilino e dashboards analíticos. |
| Banco de dados | PostgreSQL | Persistência transacional com filtros por inquilino e migração automática (DDL auto). |
| Armazenamento de arquivos | Sistema de arquivos local (`backend/uploads`) | Guarda contratos, vistorias, comprovantes e anexos de manutenção. |

## Funcionalidades-chave

### Operação imobiliária
- **Cadastro de imóveis e prédios** com paginação, controle de ocupação e limites conforme plano ativo (`ImovelController`, `PredioController`).
- **Gestão de contratos** incluindo geração de arquivos, renovação, encerramento e controle de vigências (`ContratoController`).
- **Portal do inquilino** para emissão de 2ª via, boletos e abertura de chamados (`PortalController`).
- **Vistorias e manutenção** com upload de fotos, laudos em PDF e acompanhamento de status (`VistoriaController`, `ManutencaoController`).

### Financeiro e assinaturas
- **Cobranças e pagamentos** com lançamentos, comprovantes e conciliação (`FinanceiroController`, `PagamentoController`).
- **Planos de assinatura e checkout** com integração Pix simulada e limites por tenant (`PlanoController`, `AssinaturaController`, documentação complementar em [`docs/planos-assinaturas.md`](docs/planos-assinaturas.md)).
- **Relatórios** exportados em PDF/Excel sobre ocupação, inadimplência e manutenção (`RelatorioController`).

### Segurança e multi-inquilino
- **Autenticação e autorização** baseadas em JWT, com perfis `ADMIN`, `GESTOR`, `PROPRIETARIO` e `INQUILINO` (`AuthController`, `UsuarioController`).
- **Bootstrap automático** do administrador padrão `admin@alugaplus.com` (senha `123456`) e do tenant `DEFAULT` (`UsuarioService`, `TenantBootstrap`).
- **Isolamento por cliente** via cabeçalho `X-Tenant` ou query string `?tenant=`, com filtros Hibernate ativados em cada requisição (`TenantFilter`, `TenantResolver`).
- **Cache de consultas** utilizando `spring-cache` para listas e usuários (`@Cacheable` em serviços como `UsuarioService`).

## Pré-requisitos

- Java 17+
- Maven 3.9+
- Node.js 18+ e npm 9+
- PostgreSQL 14+ com um banco criado (`alugaplus` por padrão)
- (Opcional) [MailHog](https://github.com/mailhog/MailHog) ou outro servidor SMTP local para testes de e-mail

## Configuração do backend

1. Copie `backend/src/main/resources/application.yml` e ajuste as credenciais do PostgreSQL, parâmetros JWT e caminhos de armazenamento caso necessário.
2. Crie o diretório de uploads (o padrão `backend/uploads` é criado automaticamente) garantindo permissões de escrita.
3. Execute as migrações automáticas e rode a aplicação:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. A API ficará disponível em `http://localhost:8080`. Utilize o cabeçalho `X-Tenant: DEFAULT` caso deseje isolar dados por cliente.
5. Para login inicial, utilize `admin@alugaplus.com` / `123456` e troque a senha após o primeiro acesso.

### Scripts úteis
- `mvn clean package` — gera o artefato para deploy.
- `mvn test` — executa a suíte de testes automatizados do backend.

## Configuração do frontend

1. Instale dependências e copie os assets necessários para a visualização de PDFs (executado automaticamente no `postinstall`):
   ```bash
   cd frontend
   npm install
   ```
2. Suba o servidor de desenvolvimento apontando para o backend local:
   ```bash
   npm run start
   ```
3. Acesse `http://localhost:4200`. O proxy padrão consome a API em `http://localhost:8080` e respeita o cabeçalho `X-Tenant` configurado pelo serviço de autenticação.

### Scripts úteis
- `npm run build` — compila a SPA em modo produção para `frontend/dist`.
- `npm run test` — executa os testes unitários com Karma/Jasmine.
- `npm run preview` — sobe o build de produção para validação rápida.

## Fluxos recomendados

1. **Configurar planos e limites**: Autentique-se como `ADMIN` e cadastre planos em `/admin/planos` no frontend (ou via `/planos` na API).
2. **Onboarding de um gestor**: Crie um usuário `GESTOR`, associe-o a um tenant e oriente-o a contratar um plano em `/assinaturas/checkout`.
3. **Operação diária**: Utilize os módulos de imóveis, contratos, financeiro e manutenção conforme o papel do usuário.
4. **Portal do inquilino**: Compartilhe o acesso ao módulo `portal-inquilino` para emissão de segunda via, abertura de chamados e atualizações cadastrais.

## Estrutura de diretórios

```
AlugaPlus/
├── backend/               # API Spring Boot, serviços, repositórios e configurações
│   ├── uploads/           # Armazenamento local de anexos
│   └── src/main/java/com/alugapluscrm
│       ├── controller/    # Controllers REST organizados por domínio
│       ├── dto/           # Objetos de transferência com validação Jakarta
│       ├── model/         # Entidades JPA e enums de suporte
│       ├── service/       # Regras de negócio e integrações (e-mail, arquivos, Pix mock)
│       └── tenant/        # Infraestrutura multi-inquilino
├── frontend/              # Aplicação Angular com módulos por área de negócio
│   ├── src/app/core       # Serviços compartilhados, interceptors, guards
│   └── src/app/modules    # Feature modules (dashboard, financeiro, portal, etc.)
└── docs/                  # Documentação de apoio (ex.: planos e assinaturas)
```

## Próximos passos sugeridos

- Implementar pipeline CI/CD com execução de `mvn test` e `npm run test` a cada commit.
- Externalizar segredos sensíveis (JWT, SMTP, banco) via variáveis de ambiente ou serviço de secrets.
- Adicionar monitoramento de saúde com Spring Boot Actuator (`/actuator/health`) integrado a observabilidade.
- Publicar documentação de API (OpenAPI/Swagger) para facilitar integrações externas.

## Licença

Este projeto é distribuído sob os termos definidos pelo(s) autor(es). Consulte a equipe responsável antes de publicar ou comercializar este software.
