# Twin Development Plan
Generated: 2026-05-27
Task: "Bug 1: Home não mostra nenhum cupom enquanto admin lista vários. Bug 2: /lojas mostra Amazon com 2 cupons mas página da Amazon mostra 0"
Quality Level: pragmatic

## Análise Técnica

**Bug 1:** `isStale` em `src/lib/utils.ts:21-26` usa threshold de 6 meses combinado com `success_rate === 0`, o que filtra praticamente todos os cupons do banco pois a maioria tem `success_rate` nulo/zerado e `updated_at` antigo. O admin (`AdminCouponsTab.tsx:63-73`) não aplica esse filtro, por isso exibe tudo normalmente. A Home (`src/pages/Home.tsx:44`) aplica `!isExpired(c.expiry) && !isStale(...)` e remove tudo.

**Bug 2:** `LojasPage.tsx:31` conta cupons por `c.store` (nome em texto), enquanto `StorePage.tsx:35` → `useStoreCoupons` (`src/hooks/useStoreCoupons.ts:15`) busca por `store_id` (UUID). Cupons da Amazon têm `store = "Amazon"` mas `store_id` nulo ou divergente: aparecem na contagem da listagem (string match) e somem na página individual (UUID match).

## Plano de Implementação

### Arquivos a Modificar

- `src/lib/utils.ts` — na função `isStale`, aumentar o threshold de 6 meses para 18 meses. Manter a condição `success_rate === 0` inalterada.
- `src/hooks/useStoreCoupons.ts` — adicionar parâmetro opcional `storeName` e usar `.or('store_id.eq.<id>,store.eq.<name>')` para aceitar match por UUID OU por nome. Deduplicar por `id` no resultado.
- `src/pages/StorePage.tsx` — passar `storeBrand?.name` como segundo argumento para `useStoreCoupons(storeBrand?.id, storeBrand?.name)`.

### Ordem de Implementação

1. Corrigir `src/lib/utils.ts` — alterar threshold de `isStale` para 18 meses. Mudança isolada.
2. Corrigir `src/hooks/useStoreCoupons.ts` — adicionar parâmetro `storeName`, usar `.or()` na query, deduplicar por `id`.
3. Atualizar `src/pages/StorePage.tsx` — passar `storeBrand?.name` como segundo argumento.
4. Validação manual: rodar dev server, abrir Home (cupons devem aparecer), abrir `/lojas` (anotar contagem da Amazon), abrir a página individual da Amazon (contagem deve bater).

### Riscos Técnicos

- O `.or()` com `store_id` nulo pode retornar duplicatas se um cupom tiver ambos os campos. Mitigado por deduplicação por `id` no hook.
- Ampliar `isStale` para 18 meses pode exibir cupons obsoletos que eram intencionalmente escondidos. Trade-off aceitável dado que o filtro atual está overly aggressive.

### Ação Complementar (opcional, via Supabase Dashboard)

```sql
UPDATE coupons c
SET store_id = s.id
FROM stores s
WHERE c.store = s.name
  AND c.store_id IS NULL;
```

Preenche `store_id` nos cupons órfãos, tornando o fallback por nome desnecessário a longo prazo.

## Próximo Passo
Para implementar este plano, digite: ok, continue, ou approve
Para cancelar, digite: cancel ou inicie uma nova tarefa
