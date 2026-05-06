# Motor de busca de cupons CuponitoV2 — inteligência competitiva para marketplaces sem API pública de cupons

Documento operacional para a Fase 1 e o início da Fase 2 do motor de busca de cupons do CuponitoV2, começando pelo Mercado Livre Brasil.

> Nota de governança: este plano é **compliance-first**. Ele evita contorno de autenticação, CAPTCHA, paywalls, bloqueios explícitos, rotas privadas e qualquer técnica para burlar controle de acesso. A coleta deve respeitar termos, robots.txt, limites razoáveis, LGPD, regras de afiliados e canais autorizados. Quando uma origem restringir automação, a alternativa recomendada é parceria/affiliate feed, submissão humana, newsletter opt-in ou ingestão de comunidades com permissão.

## FASE 1 — análise de mercado e engenharia reversa defensiva

### Como agregadores grandes obtêm dados

| Canal | Como funciona | Valor para o CuponitoV2 | Risco/limite |
| --- | --- | --- | --- |
| Redes de afiliados e programas próprios | Dashboards, feeds CSV/JSON, Deeplink APIs, newsletters de campanhas e materiais promocionais fornecidos pelo anunciante. | Fonte mais confiável para comissão, datas e regras de campanha. Deve ser a camada 1. | Nem sempre expõe cupom público em tempo real; depende de aprovação comercial. |
| Páginas públicas de ofertas/cupons | Páginas de campanha, home, páginas de cupom e landing pages indexáveis. | Boa cobertura de cupons massivos e campanhas sazonais. | Pode mudar layout e personalizar por usuário/região. Precisa respeitar robots/termos e limitar carga. |
| Newsletters e push opt-in | Monitoramento de caixas de e-mail próprias cadastradas legalmente nas listas das lojas. | Excelente para cupons relâmpago e campanhas segmentadas. | Cupom pode ser pessoal/intransferível; exigir classificação e não publicar cupons de uso individual. |
| Comunidades | Telegram, WhatsApp, Reddit, Pelando, grupos de achados e comentários enviados por usuários. | Alta velocidade de descoberta; bom para sinal de “cupom vivo”. | Exige moderação, deduplicação, consentimento e proteção contra spam/fraude. |
| Observação de front-end público | Renderização controlada de páginas públicas e extração de textos/atributos acessíveis ao usuário comum. | Útil para banners e cards dinâmicos sem API documentada. | Não deve tentar driblar bloqueios, login, CAPTCHA ou endpoints privados. |

### Interceptação de requisições: abordagem permitida

A estratégia é usar instrumentação de navegador **apenas para entender páginas públicas que o próprio CuponitoV2 pode acessar como usuário comum**, sem autenticação e sem engenharia para burlar proteção.

1. Abrir a página pública-alvo em ambiente de QA com DevTools ou Playwright em modo observabilidade.
2. Registrar somente metadados de rede: URL, método, status, content-type, timing e tamanho aproximado.
3. Classificar chamadas XHR/Fetch que retornem JSON ou HTML com termos como `coupon`, `cupom`, `voucher`, `discount`, `desconto`, `promotion`, `promo`, `campaign`.
4. Persistir “assinaturas” de origem, não payloads sensíveis: domínio, path normalizado, campos públicos relevantes e amostra sanitizada.
5. Se o endpoint exigir token de sessão, login, CAPTCHA, headers não triviais ou bloqueio explícito, marcar como **não coletável automaticamente** e migrar para canal autorizado.

### Anti-bot: postura de confiabilidade, não de evasão

Não adotaremos técnicas de contorno. Em vez disso, o coletor deve parecer um consumidor de infraestrutura responsável:

- identificação clara do crawler quando permitido;
- taxa baixa e jitter controlado;
- cache agressivo e revalidação condicional quando houver ETag/Last-Modified;
- backoff automático em 429/403/503;
- allowlist de URLs públicas aprovadas;
- limite por domínio e por página;
- kill switch por marketplace;
- logs de auditoria para provar volume, origem e finalidade;
- revisão manual sempre que houver mudança de termos, robots.txt ou bloqueio.

Headless browsers como Playwright devem ser usados para renderizar JavaScript quando a página pública depende disso, não para burlar detecção. Proxies só devem ser usados para resiliência regional legítima e controle de egress próprio, nunca para mascarar abuso ou evitar bloqueios.

## FASE 2 — arquitetura técnica do CuponitoV2

### Fluxo macro

```text
Origens autorizadas
  ├─ Feeds afiliados / dashboards exportáveis
  ├─ Newsletters opt-in
  ├─ Páginas públicas permitidas
  └─ Crowdsourcing moderado
        ↓
Coleta
  ├─ Jobs agendados por marketplace
  ├─ Playwright somente para renderização pública
  ├─ Coletores de e-mail/newsletter
  └─ Webhooks/formulários de usuários
        ↓
Limpeza e normalização
  ├─ Extração de código, regra, loja, categoria e validade
  ├─ Deduplicação por code + store + normalized_terms
  ├─ Classificação: público, afiliado, pessoal, suspeito
  └─ Score de confiança por fonte
        ↓
Validação
  ├─ Validação sintática e temporal
  ├─ Evidência pública: landing page, termos, banner, newsletter
  ├─ Teste controlado em sandbox/parceiros quando disponível
  └─ Sinais de usuários: funcionou/não funcionou
        ↓
Publicação
  ├─ Status: pending_review, active, unverified, expired, rejected
  ├─ Ranking por frescor, confiança, comissão e conversão
  ├─ Exibição pública e painel admin
  └─ Monitoramento de expiração e regressão
```

### Scrapers inteligentes

- Configuração por marketplace em banco: `source_url`, `allowed_paths`, `scan_interval_minutes`, `selectors`, `keywords`, `risk_level`, `enabled`.
- Extratores redundantes:
  - seletor CSS principal para cards de cupom;
  - busca textual por regex segura de cupom (`[A-Z0-9]{4,20}` com contexto de desconto);
  - leitura de JSON-LD e scripts públicos quando existirem;
  - OCR apenas para banners de imagem públicos e salvos como evidência de campanha, com revisão manual para baixa confiança.
- Detecção de mudança:
  - hash do DOM relevante;
  - hash de imagem/banner;
  - diff de campos normalizados;
  - alerta quando seletor quebra ou queda abrupta de itens coletados.

### Módulo de validação sem “sujar” contas reais

1. **Não usar contas de usuários reais.**
2. Priorizar validação por evidência: página oficial do cupom, data, termos, origem afiliada, newsletter e recorrência comunitária.
3. Para testes transacionais, usar apenas:
   - contas de QA autorizadas pelo marketplace/parceiro, quando permitido;
   - ambiente sandbox/API de parceiro, quando disponível;
   - fluxos até a tela de carrinho sem finalizar compra e respeitando termos.
4. Nunca automatizar criação massiva de contas, uso de contas pessoais, bypass de antifraude ou simulação de compras falsas.
5. Publicar níveis de confiança:
   - `verified_by_partner`: confirmado por feed/parceiro;
   - `verified_public`: evidência em página pública oficial;
   - `community_confirmed`: múltiplos usuários confirmaram recentemente;
   - `unverified`: aguardando validação;
   - `expired_or_failed`: falhou por sinais consistentes.

### Crowdsourcing

- Botão “Enviar cupom” em página de loja e página de cupom.
- Campos: loja, código, descrição, print/link de evidência, valor mínimo, validade, categoria e origem.
- Pipeline automático:
  1. normaliza código e loja;
  2. calcula duplicidade;
  3. aplica score anti-spam;
  4. cria registro `pending_review`;
  5. aumenta confiança com votos “funcionou/não funcionou”;
  6. recompensa usuário quando o cupom gera cliques/conversões válidas.
- Incentivos: ranking mensal, badges, acesso antecipado a alertas, créditos simbólicos e destaque para “caçadores confiáveis”.

## Estratégia de extração inicial: Mercado Livre Brasil

Escolha recomendada para começar: **Mercado Livre**, porque possui página pública dedicada a cupons, documentação oficial de promoções de seller para o Brasil e alto volume de comunidades de achados. A API oficial de promoções é mais voltada a vendedores e não resolve sozinha o inventário público de cupons para afiliados/editoriais.

### 🔍 Estratégia de extração: Mercado Livre

| Campo | Plano |
| --- | --- |
| Fonte do dado | Página pública de cupons/ofertas, landing pages de campanha, newsletters opt-in do Mercado Livre, materiais do programa de afiliados e submissões de usuários. |
| Onde o cupom mora | Texto do card de cupom, banner de campanha, termos da landing page, URL com rota de campanha, e ocasionalmente conteúdo renderizado por chamadas XHR públicas. |
| Método de coleta | Coletor HTTP para páginas estáticas permitidas; Playwright para renderização pública quando o cupom só aparece após JavaScript; parser de HTML/JSON público; OCR de banner apenas quando o texto está em imagem; ingestão de newsletter por caixa própria opt-in. |
| Interceptação de rede | Em QA, mapear XHR/Fetch que carregam cards de cupons e ofertas públicas. Se a chamada depender de autenticação, token de sessão, CAPTCHA ou bloqueio explícito, não automatizar e mover para fonte autorizada. |
| Frequência de varredura | Página principal de cupons: a cada 15 minutos em horário comercial e sazonal; landing pages conhecidas: 30–60 minutos; newsletter: polling/IMAP a cada 5–10 minutos; comunidades: ingestão/eventos em tempo quase real com moderação. |
| Dificuldade/risco | 6/10. Risco médio por personalização regional, mudanças de layout e possíveis restrições anti-automação. Reduzir risco usando fontes autorizadas, baixa taxa e fallback humano. |

### Como eu começaria hoje, sem API oficial completa de cupons

1. **Inventário autorizado de URLs**
   - Começar por páginas públicas de cupons/ofertas e campanhas sazonais do Mercado Livre Brasil.
   - Registrar robots.txt, termos aplicáveis e decisão de coleta por URL.

2. **Mapeamento manual em DevTools**
   - Abrir a página pública de cupons.
   - Verificar se os cards vêm no HTML inicial, scripts públicos, JSON embutido ou XHR público.
   - Capturar apenas os nomes de campos e paths úteis para criar um extrator estável.

3. **Extrator de primeira versão**
   - Baixar HTML com baixa frequência.
   - Rodar parser com seletores configuráveis e regex contextual para códigos.
   - Se a página exigir renderização, usar Playwright com bloqueio de recursos pesados não essenciais, sem login e sem tentar contornar proteção.

4. **Normalização para o modelo CuponitoV2**
   - `store_slug = mercado-livre`;
   - `code`, `title`, `description`, `discount_type`, `min_order_value`, `starts_at`, `expires_at`, `source_url`, `source_type`, `confidence_score`, `validation_status`;
   - evidência com snapshot reduzido ou hash do bloco público.

5. **Validação inicial**
   - Confirmar se o cupom aparece em página oficial ou newsletter.
   - Marcar como `verified_public` quando houver evidência oficial recente.
   - Marcar como `unverified` se vier de comunidade sem confirmação.
   - Expirar automaticamente quando sumir da origem oficial por N varreduras ou receber votos negativos consistentes.

6. **Publicação controlada**
   - No primeiro ciclo, publicar apenas cupons com evidência oficial ou revisão admin.
   - Medir CTR, taxa de voto “funcionou”, conversões afiliadas e reclamações.

### Próximos passos após confirmação

- Criar o schema Supabase para `coupon_sources`, `coupon_evidence`, `coupon_submissions` e `coupon_validation_events`.
- Criar um job serverless de coleta para Mercado Livre com feature flag desligada por padrão.
- Adicionar painel admin para revisar origens, evidências e submissões.
- Só depois expandir para Amazon ou Shopee usando o mesmo padrão de governança.

## Possíveis breaking changes

- Nenhum breaking change nesta fase documental.
- Ao implementar o schema, manter mudanças aditivas e sem renomear/remover colunas existentes.
- Ao implementar crawlers, deixar `enabled = false` por padrão até validação jurídica e operacional.

## Implementação confirmada — fundação técnica criada

Após a confirmação, a primeira entrega técnica deve ser mantida pequena, auditável e desligada por padrão:

1. **Schema Supabase aditivo**
   - `coupon_sources`: cadastro de fontes por marketplace, com `enabled = false` por padrão, intervalo, risco, seletores e metadados de compliance.
   - `coupon_evidence`: evidências extraídas de páginas públicas, feeds, newsletter, comunidade ou submissão manual.
   - `coupon_submissions`: cupons enviados por usuários, sem exposição pública dos dados de submissão.
   - `coupon_validation_events`: trilha de auditoria para sinais de validação, revisão admin, votos e expiração.

2. **Fonte seed do Mercado Livre**
   - Cadastro inicial da página pública de cupons do Mercado Livre Brasil.
   - A fonte nasce com `enabled = false`, `risk_level = 6` e `compliance_status = pending_review`.

3. **Scanner serverless inicial**
   - Função `scan-coupon-sources` varre somente fontes habilitadas e vencidas por `next_scan_at`.
   - A primeira versão suporta apenas `source_type = public_page` via HTTP com baixa carga.
   - Ela extrai candidatos por contexto textual, salva evidências em `pending_review` e evita duplicidade por hash.
   - Não faz login, não tenta contornar bloqueios, não resolve CAPTCHA e não publica cupom automaticamente.

4. **Controle operacional**
   - O job retorna “nenhuma fonte habilitada” enquanto o admin não ativar explicitamente uma origem.
   - Erros por fonte são gravados em `last_error`, e a próxima varredura respeita `scan_interval_minutes`.
   - A publicação continua dependendo de revisão/validação posterior.


## Expansão de fontes seed — Amazon Brasil e Shopee Brasil

Foram adicionadas duas novas fontes iniciais na tabela `coupon_sources`, ambas com `enabled = false` por padrão:

| Marketplace | Fonte | Intervalo inicial | Risco | Observação |
| --- | --- | --- | --- | --- |
| Amazon Brasil | `https://www.amazon.com.br/coupons` | 60 minutos | 7/10 | Confirmar public availability, termos e robots antes de habilitar. |
| Shopee Brasil | `https://shopee.com.br/m/cupom-de-desconto-v37` | 30 minutos | 6/10 | Página pública de cupons diários identificada em resultados indexados; confirmar termos/robots antes de habilitar. |

As duas fontes seguem o mesmo padrão operacional do Mercado Livre: cadastro auditável, baixa frequência inicial, `compliance_status = pending_review`, e nenhuma varredura automática até habilitação manual no Admin.
