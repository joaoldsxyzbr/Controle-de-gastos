# Controle de Gastos

Painel privado e somente leitura para visualizar os dados financeiros do projeto **Controle de Gastos**.

## Stack

- React 19 + Vite 7
- Supabase Auth com e-mail e senha
- Supabase Data API
- Supabase Realtime
- CSS puro para gráficos e layout

## Princípios

- O Supabase continua sendo a fonte de verdade.
- O site não possui ações de criar, editar, pagar ou excluir despesas.
- O acesso é pensado para uma allowlist por `auth.uid()`, não apenas para qualquer usuário autenticado.
- As credenciais usadas no navegador são somente URL do projeto + chave publishable. Nunca use `service_role` no frontend.

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

Ao criar uma nova tabela mensal, adicione o nome em `MONTH_TABLES` em `src/hooks/useGastos.js` e configure a mesma política de leitura/Reatime no Supabase.

## Segurança do banco

O arquivo `supabase/001_dashboard_readonly.sql` contém a configuração preparada para:

1. criar uma allowlist `dashboard_access`;
2. permitir somente `SELECT` nas tabelas mensais;
3. restringir a leitura ao `auth.uid()` autorizado;
4. habilitar Realtime nas tabelas do painel.

A allowlist começa vazia. Depois de criar o usuário em **Authentication > Users**, insira somente o UUID desse usuário em `dashboard_access`.

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
