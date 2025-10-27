# Planos e Assinaturas

## Backend

### Rotas de Planos (`/api/planos`)
- `GET /api/planos` — lista planos ativos (publico)
- `GET /api/planos/admin?page=&size=` — lista paginada (ADMIN)
- `GET /api/planos/{id}` — detalhes (ADMIN)
- `POST /api/planos` — cria plano (ADMIN)
- `PUT /api/planos/{id}` — atualiza plano (ADMIN)
- `DELETE /api/planos/{id}` — desativa plano (ADMIN)

### Rotas de Assinaturas (`/api/assinaturas`)
- `GET /api/assinaturas` — lista paginada (ADMIN)
- `GET /api/assinaturas/{id}` — detalhes (ADMIN)
- `GET /api/assinaturas/me` — assinatura do usuario logado (GESTOR/PROPRIETARIO)
- `POST /api/assinaturas` — cria assinatura e gera Pix quando aplicavel (GESTOR/PROPRIETARIO)
- `PUT /api/assinaturas/{id}/cancelar` — cancela (GESTOR/PROPRIETARIO/ADMIN)

### Regras Importantes
- Um usuario so pode ter uma assinatura ativa/pendente.
- Limites de imoveis e contratos sao validados na criacao (`ImovelService`, `ContratoService`).
- Pagamento via Pix gera chave e codigo copiado (stub local).
- Novos papeis: `PROPRIETARIO` (visualiza/usa planos), `ADMIN` exclusivo para gestao da plataforma.

## Frontend

### Modulo Administrativo (`/admin`)
- `/admin/planos` — listagem; criar/editar/desativar planos.
- `/admin/assinaturas` — visao geral das assinaturas; detalhamento em `/admin/assinaturas/:id`.

### Modulo de Checkout (`/assinaturas/checkout`)
- Disponivel para GESTOR/PROPRIETARIO.
- Exibe planos ativos, seleciona forma de pagamento e inicia assinatura.
- Para Pix, mostra chave e codigo copiavel.

## Fluxo Rapido
1. Acessar `/admin/planos` (perfil ADMIN) para criar/ajustar planos.
2. Logar como gestor e abrir `/assinaturas/checkout` para contratar um plano.
3. Concluir o pagamento com a chave Pix e aguardar status `ATIVA`.
4. Limites passam a valer imediatamente para imoveis e contratos do tenant atual.
