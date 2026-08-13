# Controle de Gastos

Painel privado e somente leitura para visualizar os dados financeiros do projeto **Controle de Gastos**.

## Stack

- React 19 + Vite 7
- Supabase Auth com e-mail e senha
- Supabase Data API
- Supabase Realtime opcional
- CSS puro para gráficos e layout

## Princípios

- O Supabase continua sendo a fonte de verdade.
- O site não possui ações de criar, editar, pagar ou excluir despesas.
- O acesso é pensado para uma allowlist por `auth.uid()`, não apenas para qualquer usuário autenticado.
- O frontend usa somente URL do projeto + chave publishable. Nunca use `service_role` no navegador.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
VITE_SUPABASE_URL=https://cbvzvkxmovsxcfhnfdus.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publishable
```

Em produção, configure as mesmas variáveis no provedor de deploy. A chave publishable não fica gravada no código-fonte.

## Tabelas lidas

O painel atual acompanha:

- `09-2026`
- `10-2026`
- `11-2026`
- `12-2026`
- `01-2027`
- `02-2027`
- `03-2027`
- `04-2027`

Ao criar uma nova tabela mensal, adicione o nome em `MONTH_TABLES` em `src/hooks/useGastos.js` e configure a mesma política de leitura no Supabase.

## Segurança do banco

Os arquivos em `supabase/` estão separados em etapas pequenas:

1. `001_dashboard_access.sql` cria a allowlist `dashboard_access` e a política para o próprio usuário.
2. `002_monthly_read_policies.sql` habilita RLS e libera somente `SELECT` das tabelas mensais para usuários autorizados.

A allowlist começa vazia. Depois de criar seu usuário em **Authentication > Users**, autorize somente o UUID desejado:

```sql
insert into public.dashboard_access (user_id) values ('SEU-UUID-AQUI');
```

Para atualização instantânea, habilite as tabelas mensais em **Database > Replication / Realtime** no painel do Supabase. Mesmo sem Realtime, o botão **Atualizar dados** continua funcionando.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`

O projeto contém `_headers` e `_redirects` em `public/` para serem incluídos no build.
