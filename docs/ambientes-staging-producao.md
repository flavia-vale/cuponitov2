# Ambientes: `staging` + `main` (plano de implantação)

> Objetivo: replicar no Cuponito o modelo que já usamos no **wabot** — uma branch `staging`
> (ambiente de testes, acessível por um link próprio) e a branch `main` (produção,
> `www.cuponito.com.br`).

**Status:** em execução. Ver `## 0. Progresso` abaixo para o que já foi feito e o que falta.
**Autor:** Claude · **Data:** 2026-07-27

## 0. Progresso

| Fase | O que | Status |
|---|---|---|
| 1 | Branch `staging` criada a partir de `main`, pushada para o remoto | ✅ Feito |
| 1 | Regras de proteção (PR obrigatório, sem force-push) em `main`/`staging` | ⏳ Manual — nenhuma ferramenta com acesso à API de branch protection do GitHub está disponível nesta sessão. Fazer em GitHub → Settings → Branches. |
| 2 | Domínio `staging.cuponito.com.br` na Vercel | ⏳ Manual — requer acesso à dashboard/DNS da Vercel, que não tenho nesta sessão. |
| 3 | `SITE_URL` centralizado (código) | ✅ Feito — commit `9c22ec0` na branch `claude/focused-hopper-qln3xo` |
| 4 | `client.ts` do Supabase lendo de env (código) | ✅ Feito — mesmo commit |
| 4 | `noindex` automático fora de produção (código) | ✅ Feito — mesmo commit, validado com build simulando `VERCEL_ENV=preview` |
| 4 | `.env` removido do git + `.env.example` criado | ✅ Feito — mesmo commit |
| 4 | Rotação das chaves Supabase que estavam no `.env` versionado | ⏳ Manual — requer dashboard do Supabase |
| 4 | Variáveis de ambiente por escopo (Production/Preview) na Vercel | ⏳ Manual — requer dashboard da Vercel |
| 5 | Projeto Supabase de staging (novo projeto + migrations + seed) | ⏳ Manual — criação de projeto novo tem implicação de billing/conta; não faço isso sem autorização explícita e acesso |
| 6 | CI (`deploy-supabase-functions.yml`) por branch | ✅ Feito — mesmo commit. Faz *skip* seguro do deploy em `staging` até a variável `SUPABASE_PROJECT_REF_STAGING` existir |

**Bloqueio para as fases 2 e 5:** preciso de credenciais/acesso que não tenho neste ambiente
(token da Vercel, ou acesso à conta Supabase para criar o projeto novo). Essas etapas dependem
de ação manual no navegador — ver os passos exatos nas Fases 2 e 5 abaixo.

---

## 1. Diagnóstico do estado atual

| Item | Situação hoje |
|---|---|
| Branches | Apenas `main` + branches efêmeras `claude/*`. Não existe `staging`. |
| Hospedagem | **Vercel** (`vercel.json`, `api/*.ts` como serverless, `middleware.ts` como Edge Middleware, `@vercel/node` nas deps). |
| Build | `vite build && node scripts/create-spa-fallbacks.mjs` |
| Banco | Um único projeto Supabase: `jyvmrkykukialdbcebei` (em `supabase/config.toml` e no workflow). |
| CI | `.github/workflows/deploy-supabase-functions.yml` — deploya Edge Functions **só no push para `main`**. |
| Domínio | `https://www.cuponito.com.br` **hardcoded** em 12+ lugares. |
| Segredos | ⚠️ `.env` está **versionado no git** (não está no `.gitignore`). |

### Diferença estrutural em relação ao wabot

No wabot o acesso alternativo é `178.105.54.0:3006` — uma **VPS própria** servindo a app numa porta.
O Cuponito **não roda em VPS**: ele depende de recursos da plataforma Vercel
(`api/sitemap.ts`, `api/sync-lomadee.ts`, `api/sync-rakuten.ts` e o `middleware.ts` de prerender para bots).
Servir por `IP:porta` numa VPS exigiria reimplementar essas quatro coisas num servidor Node — trabalho
grande e sem ganho.

**Portanto o equivalente ao "outro link" aqui é um domínio de staging na Vercel**, ex.:

- `https://staging.cuponito.com.br` (recomendado — subdomínio do domínio que já temos), ou
- `https://cuponito-staging.vercel.app` (sem precisar mexer no DNS).

A alternativa VPS por `IP:porta` está no **Anexo B**, caso seja requisito real.

---

## 2. Decisões (defaults assumidos)

| # | Decisão | Default adotado | Alternativa |
|---|---|---|---|
| D1 | Onde roda o staging | Vercel, branch `staging` com domínio fixo | VPS por `IP:porta` (Anexo B) |
| D2 | Banco do staging | **Projeto Supabase separado** | Mesmo banco de produção (Anexo A) |
| D3 | Fluxo git | `feature → staging → main` | `feature → main`, staging espelho |

Se D1/D2/D3 mudarem, só as Fases 2, 5 e 6 são afetadas — as Fases 1, 3 e 4 valem em qualquer cenário.

---

## 3. Fluxo de trabalho alvo

```
claude/minha-feature ──PR──► staging ──PR (release)──► main
                              │                         │
                              ▼                         ▼
                    staging.cuponito.com.br      www.cuponito.com.br
                    Supabase STAGING             Supabase PROD
                    noindex                      indexável
```

Regras:
- Ninguém commita direto em `main` nem em `staging` — sempre PR.
- `main` é sempre igual ao que está no ar em produção.
- Migration nova é aplicada **primeiro** no Supabase de staging, validada, e só depois no de produção.

---

## Fase 1 — Criar as branches e proteger (30 min)

1. Criar `staging` a partir de `main`:
   ```bash
   git fetch origin main
   git checkout -B staging origin/main
   git push -u origin staging
   ```
2. No GitHub → Settings → Branches, criar regras para `main` e `staging`:
   - Require pull request before merging (1 aprovação em `main`, 0 em `staging`).
   - Require status checks (assim que a Fase 6 estiver de pé).
   - Bloquear force-push e deleção.
3. GitHub → Settings → General → Default branch: manter `main` (o deploy de produção depende disso).

**Entregável:** branch `staging` no remoto + regras de proteção ativas.

---

## Fase 2 — Ligar o staging na Vercel (1 h)

Na dashboard da Vercel, projeto do Cuponito:

1. **Settings → Git → Production Branch**: confirmar `main`.
2. **Settings → Git → Deploy Hooks / Preview Branches**: garantir que `staging` gera Preview Deployment.
3. **Settings → Domains**: adicionar `staging.cuponito.com.br` e apontar para a branch `staging`
   (na Vercel: "Add Domain" → *Assign to a branch* → `staging`). Isso dá um **link fixo**, não a URL
   aleatória de cada deploy.
   - No DNS do domínio: `CNAME staging → cname.vercel-dns.com`.
   - Se preferir não mexer no DNS agora, usar o domínio `cuponito-staging.vercel.app`.
4. **Settings → Deployment Protection**: decidir se o staging fica público ou atrás de senha
   (recomendo *Password Protection* ou *Vercel Authentication* — evita que staging vaze para o público
   e para buscadores).

**Entregável:** `https://staging.cuponito.com.br` servindo a branch `staging`.

---

## Fase 3 — Tirar o domínio do hardcode (2 h · mudança de código)

Hoje `https://www.cuponito.com.br` está fixo no código, então o staging geraria canonical, sitemap e
Open Graph apontando para produção — o que quebra o SEO e confunde os testes.

Arquivos a alterar:

| Arquivo | Hoje | Vira |
|---|---|---|
| `src/lib/seo.ts` | `export const SITE_URL = 'https://www.cuponito.com.br'` | lê `import.meta.env.VITE_SITE_URL` com fallback para o domínio de prod |
| `middleware.ts:12` | `const SITE_URL = '...'` | `process.env.SITE_URL ?? 'https://www.cuponito.com.br'` |
| `api/sitemap.ts:9` | `const BASE_URL = '...'` | idem, via `process.env.SITE_URL` |
| `src/pages/StorePage.tsx`, `BlogList.tsx`, `LojasPage.tsx`, `CuponsPage.tsx`, `institutional/*.tsx` | `canonical="https://www.cuponito.com.br/..."` | `canonical={\`${SITE_URL}/...\`}` importando de `src/lib/seo.ts` |

Uma constante única (`SITE_URL`) passa a ser a fonte da verdade em todo o app.
Nenhuma mudança de comportamento em produção — o fallback é o valor atual.

**Entregável:** PR "chore: centraliza SITE_URL por ambiente".

---

## Fase 4 — Variáveis de ambiente por ambiente (1 h)

Na Vercel, cada variável tem escopo *Production* / *Preview* / *Development*. Configurar:

| Variável | Production | Preview (staging) |
|---|---|---|
| `VITE_SITE_URL` | `https://www.cuponito.com.br` | `https://staging.cuponito.com.br` |
| `SITE_URL` | mesma coisa (usada por `middleware.ts` e `api/`) | idem staging |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PROJECT_ID` | projeto PROD | projeto STAGING |
| `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | PROD | STAGING |
| `SYNC_SECRET`, `LOMADEE_API_KEY`, `RAKUTEN_TOKEN` | reais | valores de teste (ou ausentes, para não sincronizar de verdade) |

### 4.1 — Bloquear indexação do staging (obrigatório)

Sem isso o Google indexa o staging e canibaliza o SEO de produção.

- Em `scripts/create-spa-fallbacks.mjs` (que já roda pós-build), quando
  `process.env.VERCEL_ENV !== 'production'`, sobrescrever `dist/robots.txt` com:
  ```
  User-agent: *
  Disallow: /
  ```
- E no `middleware.ts`, ampliar o `matcher` para responder com header
  `X-Robots-Tag: noindex, nofollow` quando `VERCEL_ENV !== 'production'`.

### 4.2 — Corrigir o `.env` versionado ⚠️

O arquivo `.env` está commitado. Independente do staging, isso precisa ser resolvido:

```bash
git rm --cached .env
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore
```
Criar `.env.example` só com os nomes das chaves. **Rotacionar as chaves Supabase expostas** —
elas estão no histórico do git e o histórico não some com o `git rm`.

**Entregável:** PR "chore: env por ambiente + noindex no staging + remove .env do git".

---

## Fase 5 — Banco de staging (2 h)

1. Criar novo projeto Supabase (`cuponito-staging`, mesma região).
2. Aplicar todas as migrations:
   ```bash
   supabase link --project-ref <ref-staging>
   supabase db push
   ```
3. Copiar um subconjunto de dados de produção para ter com que testar
   (lojas, categorias de cupom, categorias de blog e ~50 cupons). Sem dados de usuário.
4. Replicar as policies RLS (vêm nas migrations) e os secrets das Edge Functions.
5. Registrar o novo `project_id` — **atenção:** `supabase/config.toml` é versionado e aponta para prod;
   o link de staging deve ser feito por `--project-ref` na CLI/CI, não editando o arquivo.

**Entregável:** projeto Supabase de staging com schema idêntico ao de produção.

---

## Fase 6 — CI: Edge Functions por branch (1 h)

`deploy-supabase-functions.yml` hoje só dispara em `main`. Ajustar:

```yaml
on:
  push:
    branches: [main, staging]
    paths: ['supabase/functions/**', '.github/workflows/deploy-supabase-functions.yml']
```

e escolher o project ref pela branch:

```yaml
env:
  SUPABASE_PROJECT_REF: ${{ github.ref == 'refs/heads/main'
    && vars.SUPABASE_PROJECT_REF_PROD
    || vars.SUPABASE_PROJECT_REF_STAGING }}
```

Cadastrar `SUPABASE_PROJECT_REF_PROD` / `SUPABASE_PROJECT_REF_STAGING` em GitHub → Settings →
Variables, e o `SUPABASE_ACCESS_TOKEN` continua como secret.

Opcional (recomendado): adicionar um workflow de CI rodando `npm run lint` + `npm run build` em todo
PR, e exigi-lo como status check nas duas branches protegidas.

**Entregável:** PR "ci: deploy de edge functions por ambiente".

---

## 7. Ordem de execução e esforço

| Ordem | Fase | Esforço | Bloqueia |
|---|---|---|---|
| 1 | Fase 1 — branches + proteção | 30 min | — |
| 2 | Fase 5 — Supabase staging | 2 h | Fase 4 |
| 3 | Fase 3 — SITE_URL centralizado | 2 h | Fase 4 |
| 4 | Fase 4 — env vars + noindex + `.env` | 1 h | Fase 2 |
| 5 | Fase 2 — domínio na Vercel | 1 h | — |
| 6 | Fase 6 — CI por branch | 1 h | — |

Total: ~7-8 h de trabalho, sem downtime de produção em nenhuma etapa.

---

## 8. Checklist de validação (fazer depois de tudo)

- [ ] `https://staging.cuponito.com.br` abre a home do Cuponito.
- [ ] Um commit em `staging` aparece no link de staging em poucos minutos.
- [ ] `curl https://staging.cuponito.com.br/robots.txt` retorna `Disallow: /`.
- [ ] `view-source` no staging: `<link rel="canonical">` aponta para o domínio de staging, não para o de prod.
- [ ] Admin do staging (`/admin`) autentica contra o Supabase de staging.
- [ ] Criar um cupom no staging **não** faz ele aparecer em `www.cuponito.com.br`.
- [ ] `https://staging.cuponito.com.br/sitemap.xml` gera URLs com o domínio de staging.
- [ ] Push em `main` continua deployando produção normalmente.
- [ ] Force-push em `main` e `staging` bloqueado pelas regras.
- [ ] `.env` não aparece mais em `git ls-files`, e as chaves antigas foram rotacionadas.

---

## Anexo A — Se o staging usar o mesmo banco de produção

Setup instantâneo (só as Fases 1-4, sem a 5), mas:
- Qualquer teste no admin (criar/editar/deletar cupom, loja, categoria, post) **altera a produção**.
- Não dá para testar migration antes de aplicar em prod — que é metade do valor de ter staging.

Se for por esse caminho: usar um usuário admin dedicado de teste, e nunca testar fluxos de escrita
(publicação de post, sync de cupons, deleção) no staging.

## Anexo B — Se for mesmo VPS por `IP:porta` (modelo wabot)

Necessário para servir o Cuponito em, por exemplo, `IP:3006`:

1. Dockerfile multi-stage: `node build` → `nginx` servindo `dist/` com `try_files ... /index.html`.
2. Substituir o que é Vercel-específico:
   - `api/sitemap.ts`, `api/sync-lomadee.ts`, `api/sync-rakuten.ts` → um pequeno servidor Express
     (ou rodar essas três só na Vercel e não expor no VPS).
   - `middleware.ts` (prerender para bots) → não existe fora da Vercel; ou reescrever em nginx+Node,
     ou aceitar que o staging na VPS não prerenderiza para bots (aceitável, já que é `noindex`).
3. `docker compose` com a porta `3006:80` + `restart: unless-stopped`.
4. Workflow GitHub Actions no push para `staging`: build da imagem → SSH → `docker compose up -d`.
5. Sem HTTPS por padrão em `IP:porta` — o admin faz login via Supabase; sem TLS o token trafega em
   claro. Recomendo um subdomínio + Caddy/Let's Encrypt em vez de IP puro.

Esforço estimado: +6-8 h em cima do plano principal, e passa a ser mais um ambiente para manter.
