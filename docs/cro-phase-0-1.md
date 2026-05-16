# CRO Phase 0 & 1 Execution (Cuponito)

## Scope
This document operationalizes Phase 0 (baseline + experiment discipline) and Phase 1 (quick wins in copy/hierarchy) for the web app.

## Phase 0 — Baseline & Experiment Guardrails

### KPIs (weekly)
- coupon_ctr = coupon_click / sessions
- copy_rate = coupon_copy / coupon_click
- whatsapp_ctr = whatsapp_click / sessions
- search_to_click = search_submit_with_term_then_coupon_click / sessions

### Event taxonomy
- `coupon_click`
- `coupon_copy`
- `whatsapp_click`
- `search_submit`

### Minimal baseline process
1. Deploy to staging.
2. Capture 7 days of events (or minimum 500 sessions).
3. Export KPI baseline to this file before running A/B tests.

### Experiment log template
- Hypothesis
- Variant A
- Variant B
- KPI primary
- KPI guardrail
- Start date
- End date
- Decision (ship/revert/iterate)

## Phase 1 — Quick Wins (implemented)

1. Hero default value proposition copy made more specific and outcome-oriented.
2. Header reduced visual weight for Blog CTA to avoid competing with coupon intent on cold traffic.
3. Home section links clarified from generic “Ver todos” to “Ver todos os cupons verificados”.
4. Featured coupon card CTA clarified to “Copiar e ir para loja”.

## Risk control
- No API/schema changes.
- No breaking changes in props/contracts.
- No production DB writes added.
- UI-only and analytics helper-only changes.
