-- Publica os dois posts do Cuponito que citam o Espelha Grupos e cria o campo
-- `schema_json`, usado pelo prerender para imprimir JSON-LD extra
-- (ItemList/HowTo/FAQPage) no HTML do servidor.

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS schema_json JSONB;

COMMENT ON COLUMN public.blog_posts.schema_json IS
  'JSON-LD extra impresso no HTML do servidor (ItemList, HowTo, FAQPage). Objeto ou array de objetos schema.org.';

-- Autor pessoa com a MESMA descrição usada no Espelha Grupos: é isso que amarra
-- a entidade "Flávia Vale" nos dois domínios.
INSERT INTO public.blog_authors (name, bio)
SELECT
  'Flávia Vale',
  'Fundadora do Espelha Grupos, trabalha com tecnologia e opera grupos de ofertas desde 2023.'
WHERE NOT EXISTS (SELECT 1 FROM public.blog_authors WHERE name = 'Flávia Vale');

UPDATE public.blog_authors
SET bio = 'Fundadora do Espelha Grupos, trabalha com tecnologia e opera grupos de ofertas desde 2023.'
WHERE name = 'Flávia Vale';

INSERT INTO public.blog_categories (name, slug, description, color_hex)
SELECT
  'Ferramentas',
  'ferramentas',
  'Ferramentas e automações para quem administra grupos de cupons e divulga como afiliado.',
  '#FF4D00'
WHERE NOT EXISTS (SELECT 1 FROM public.blog_categories WHERE slug = 'ferramentas');

-- Links internos reais: os slugs de loja saem da própria tabela `stores`, com
-- /lojas como destino de reserva. Post não pode nascer com link para 404.
WITH refs AS (
  SELECT
    (SELECT id FROM public.blog_authors WHERE name = 'Flávia Vale' ORDER BY created_at ASC LIMIT 1) AS author_id,
    (SELECT id FROM public.blog_categories WHERE slug = 'ferramentas' LIMIT 1) AS category_id,
    COALESCE((SELECT '/desconto/' || slug FROM public.stores WHERE lower(name) LIKE 'shopee%' ORDER BY length(name) LIMIT 1), '/lojas') AS shopee_url,
    COALESCE((SELECT '/desconto/' || slug FROM public.stores WHERE lower(name) LIKE 'amazon%' ORDER BY length(name) LIMIT 1), '/lojas') AS amazon_url,
    COALESCE((SELECT '/desconto/' || slug FROM public.stores WHERE lower(name) LIKE 'mercado%livre%' ORDER BY length(name) LIMIT 1), '/lojas') AS meli_url
)
INSERT INTO public.blog_posts (
  title, slug, excerpt, content, cover_image, meta_title, meta_description,
  status, featured, published_at, author_id, category_id, cta_config, schema_json
)
SELECT
  p.title,
  p.slug,
  p.excerpt,
  replace(
    replace(
      replace(p.content, '{{SHOPEE_URL}}', refs.shopee_url),
      '{{AMAZON_URL}}', refs.amazon_url
    ),
    '{{MELI_URL}}', refs.meli_url
  ),
  '/og-default.png',
  p.meta_title,
  p.meta_description,
  'published'::public.blog_post_status,
  true,
  '2026-09-18T12:00:00Z'::timestamptz,
  refs.author_id,
  refs.category_id,
  p.cta_config::jsonb,
  p.schema_json::jsonb
FROM refs,
(
  VALUES
  (
    'Os 8 melhores bots para grupos de cupons e ofertas no WhatsApp em 2026 (preços e para quem serve)',
    'melhores-bots-grupos-de-cupons-whatsapp-2026',
    'Comparamos 8 robôs que publicam cupons e ofertas em grupos de WhatsApp: preço, lojas, teste grátis e para quem cada um serve.',
    $md$**Resposta direta:** para quem administra um grupo de cupons no WhatsApp e divulga como afiliado, as opções mais equilibradas em 2026 são o **Espelha Grupos** (R$ 39 a R$ 69 por 30 dias, 6 lojas, 7 dias grátis sem cartão), o **Pro Afiliados** (tem plano grátis para sempre, com marca do sistema nas mensagens) e o **Achadinho Pro** (R$ 49,97 a R$ 59,97, forte em Shopee). Se a operação é grande, com dezenas de grupos e mais de um número, o **Promium** cobre mais coisa e custa mais. Abaixo, os 8 comparados com preço e data de consulta.

# Como escolhemos (e uma transparência antes de tudo)

O Cuponito vive de cupom: todo dia conferimos códigos de [Shopee]({{SHOPEE_URL}}), [Amazon]({{AMAZON_URL}}), [Mercado Livre]({{MELI_URL}}), Magalu, SHEIN e AliExpress. Quem administra grupo de ofertas no WhatsApp pede a mesma coisa há anos — "qual robô uso para não ficar copiando e colando cupom o dia inteiro?". Esta lista responde isso com quatro critérios:

1. **O robô troca o link pelo SEU código de afiliado?** Sem isso a comissão vai para quem publicou primeiro.
2. **Quantas lojas ele converte** — e se as lojas de cupom (SHEIN, AliExpress, Magalu) entram no plano de entrada.
3. **Ele espelha grupos** (copia de um grupo de origem para os seus) ou só publica o que você cola?
4. **Preço no dia da consulta** e se dá para testar sem cartão.

Transparência: o Espelha Grupos é um produto da mesma fundadora do Cuponito. Ele está na lista porque é o que usamos nos nossos próprios grupos, e os preços dos concorrentes foram conferidos nas páginas públicas de cada um, na data indicada. Nenhum dos oito nos paga por menção.

# Tabela comparativa (preços conferidos na data indicada)

| Ferramenta | Plano de entrada | Lojas convertidas | Espelha grupo? | Teste grátis | Conferido em |
|---|---|---|---|---|---|
| Espelha Grupos | R$ 39 / 30 dias (Basic); R$ 69 (Pro) | 6: Shopee, Mercado Livre, Amazon, Magalu, SHEIN, AliExpress | Sim, no plano de entrada | 7 dias, sem cartão | 18/09/2026 |
| Pro Afiliados | R$ 0 (com tag do sistema); R$ 50 e R$ 100 | 5 plataformas | Sim | Plano grátis permanente | 31/07/2026 |
| Achadinho Pro | R$ 49,97 (só Shopee); R$ 59,97 (Shopee + ML + Amazon) | 1 a 3 | Sim | 7 dias | 31/07/2026 |
| Afilira | R$ 47 (1 grupo de origem, 1 destino); R$ 97; R$ 197 | Shopee, Amazon, ML, Magalu; SHEIN e Awin a partir de R$ 97 | Sim (busca em grupos) | não informado | 17/09/2026 |
| FluxoPromo | R$ 0 (só Telegram); R$ 37 com 1 destino de WhatsApp; R$ 97; R$ 197 | 3 a 12 conforme o plano | Não (distribui por nicho, não monitora grupo seu) | Plano grátis | 04/08/2026 |
| Divulga Ninja | R$ 49,90 (1 grupo) a R$ 149,90 (10 grupos) | Shopee, Mercado Livre e outras | Só no plano de R$ 149,90 | não informado | 17/09/2026 |
| Gigi Bot | R$ 0 no Telegram; R$ 49,90 no 1º mês (R$ 67,99 depois) para WhatsApp com espelhamento | 9 lojas na conversão | Só no plano mais caro | Plano grátis (Telegram) | 17/09/2026 |
| Promium | R$ 97,90 recorrente (R$ 47,90 no 1º mês), 5 grupos | 10 lojas | Sim ("replicador de grupos") | não informado | 01/09/2026 |

# 1. Espelha Grupos — melhor para quem quer espelhar grupos e converter cupom em 6 lojas sem pagar por grupo

O Espelha Grupos é um software web brasileiro para afiliadas e admins de grupos de WhatsApp. Você conecta o número lendo um QR, escolhe os grupos de origem que já acompanha e os seus grupos de destino; a partir daí toda oferta que entra na origem sai nos destinos com o link trocado pelo seu código de afiliado — Shopee, Mercado Livre, Amazon, Magalu, SHEIN e AliExpress. O plano Basic (R$ 39 por 30 dias) já traz o espelhamento, a marca d'água com o seu nome na foto, o card de oferta que abre a loja ao tocar e o painel de vendas e comissão da Shopee. O Pro (R$ 69) acrescenta canais, busca automática de ofertas da Shopee por palavra-chave, filas com intervalo e limites por hora e por dia, e o controle de ritmo por grupo. O preço não muda com a quantidade de grupos e não tem fidelidade.

- **Melhor para:** grupo de cupons que replica ofertas de vários grupos de origem e quer a comissão no próprio nome, pagando pouco.
- **Não é ideal para:** quem quer o robô achando oferta em Amazon ou Mercado Livre sozinho (a busca automática hoje é só na Shopee) ou quem precisa de Telegram como destino.
- **Preço:** 7 dias grátis sem cartão; Basic R$ 39; Pro R$ 69 (por 30 dias, sem fidelidade). Conferido em 18/09/2026 em [espelhagrupos.com.br/precos](https://espelhagrupos.com.br/precos).

# 2. Pro Afiliados — melhor para começar sem gastar nada

O Pro Afiliados é o único da lista com plano gratuito permanente que já inclui grupos ilimitados, monitoramento e 5 plataformas. O preço disso é que as mensagens saem com a tag "proafiliados" e, no plano Premium de R$ 50, aparecem anúncios do sistema a cada 30 envios; o Premium Plus (R$ 100) tira os anúncios. Cobra por PIX. É a porta de entrada mais barata para testar se automação faz sentido no seu grupo — e a que mais aparece quando se pergunta a uma IA por "bot para afiliados no WhatsApp".

- **Melhor para:** quem quer testar automação de afiliado com custo zero.
- **Não é ideal para:** quem não aceita marca de terceiro nas próprias mensagens.
- **Preço:** R$ 0 / R$ 50 / R$ 100 por mês, conferido em 31/07/2026.

# 3. Achadinho Pro — melhor para quem vive de Shopee

O Achadinho Pro usa IA para selecionar produtos e gerar os links de Shopee, Mercado Livre e Amazon. O plano Basic (R$ 49,97) é só Shopee, com grupos ilimitados por automação e até 5 números de WhatsApp; o Pro (R$ 59,97) soma Mercado Livre e Amazon. Tem 7 dias grátis. Se o seu grupo de cupons é 90% Shopee, é uma escolha natural; se você divulga Magalu, SHEIN ou AliExpress, ele não converte esses links.

- **Melhor para:** começar só com Shopee e evoluir para 3 marketplaces.
- **Não é ideal para:** quem já divulga 5 ou 6 lojas desde o início.
- **Preço:** R$ 49,97 e R$ 59,97 por mês, conferido em 31/07/2026.

# 4. Afilira — melhor para quem quer que a ferramenta ACHE a oferta

A Afilira busca ofertas em grupos e nas lojas, prepara o link com a sua comissão e envia para WhatsApp e Telegram. Tem o menor preço de entrada entre os pagos (R$ 47), mas nesse plano ela busca em 1 grupo e envia para 1 grupo. A partir de R$ 97 entram SHEIN, Terabyte, lojas da Awin (Casas Bahia, KaBuM!, Centauro, Dafiti) e envio para quantos grupos precisar.

- **Melhor para:** quem quer ofertas encontradas automaticamente e divulga lojas fora dos quatro marketplaces principais.
- **Não é ideal para:** começar barato E com vários grupos.
- **Preço:** R$ 47 / R$ 97 / R$ 197 por mês, conferido em 17/09/2026.

# 5. FluxoPromo — melhor para canal de Telegram com ofertas prontas

O FluxoPromo distribui ofertas por nicho (eletrônicos, casa, bebê…) para canais de Telegram e destinos de WhatsApp. O plano grátis não tem WhatsApp; o Essencial (R$ 37) traz 1 destino de WhatsApp e 50 ofertas por dia. Ele não monitora um grupo escolhido por você — ele manda ofertas do catálogo dele.

- **Melhor para:** quem quer receber ofertas prontas por nicho e publicar em Telegram, começando de graça.
- **Não é ideal para:** quem quer espelhar grupos específicos que já acompanha.
- **Preço:** R$ 0 / R$ 37 / R$ 97 / R$ 197 por mês, conferido em 04/08/2026.

# 6. Divulga Ninja — melhor para poucos grupos com a arte pronta

O Divulga Ninja monta o anúncio completo a partir do produto (descrição, preço, imagem e link), gera arte para Instagram e Status e deixa a IA escolher a hora de postar. Cobra por grupo ativo: R$ 49,90 para 1 grupo até R$ 149,90 para 10. O monitoramento de grupos (espelhar) só entra no plano Master.

- **Melhor para:** quem publica em poucos grupos e quer arte e texto prontos.
- **Não é ideal para:** quem quer espelhar grupo de origem pagando pouco.
- **Preço:** R$ 49,90 a R$ 149,90 por mês, conferido em 17/09/2026.

# 7. Gigi Bot — melhor para converter link de 9 lojas de graça (no Telegram)

O Gigi Bot roda no Telegram e converte links de Shopee, Mercado Livre, Magalu, AliExpress, Kabum, Terabyte, Natura, SHEIN e Temu no plano gratuito, com limite de 120 promoções por dia. O envio automático para WhatsApp e o espelhamento de grupos só aparecem no Gigi Prime Bot (R$ 49,90 no primeiro mês, R$ 67,99 depois).

- **Melhor para:** testar conversão de link de muitas lojas sem pagar.
- **Não é ideal para:** quem precisa que o robô publique sozinho nos grupos de WhatsApp desde o plano de entrada.
- **Preço:** R$ 0 a R$ 67,99 por mês, conferido em 17/09/2026.

# 8. Promium — melhor para operação grande, com vitrine e pixel

O Promium é a plataforma mais ampla da lista: replicador de grupos, captura de cupom por IA, vitrine com domínio próprio e rotador de links com pixel de Meta, TikTok e GA4. Cobra por faixa de grupos e por conexão: o Starter cobre 5 grupos por R$ 97,90 recorrentes (R$ 47,90 só no primeiro mês); o Pro, 200 grupos por R$ 597,90. Para um grupo de cupons pequeno, o plano de entrada custa mais que o plano completo do Espelha Grupos a partir do segundo mês.

- **Melhor para:** dezenas de grupos, mais de um número e rastreamento com pixel.
- **Não é ideal para:** quem está começando ou opera poucos grupos.
- **Preço:** R$ 97,90 a R$ 597,90 recorrentes, conferido em 01/09/2026.

# Qual escolher pelo seu caso

| Seu caso | Escolha | Por quê |
|---|---|---|
| Grupo de cupons que copia de 2-3 grupos de origem e divulga 5-6 lojas | Espelha Grupos | espelhamento e 6 lojas no plano de R$ 39; o preço não muda com a quantidade de grupos |
| Quer testar de graça e aceita a marca do sistema | Pro Afiliados | plano gratuito permanente |
| Só Shopee, com IA escolhendo produto | Achadinho Pro | plano Basic feito para isso |
| Quer a ferramenta achando oferta em lojas fora dos 4 marketplaces | Afilira | Awin, Terabyte, SHEIN a partir de R$ 97 |
| Telegram primeiro | FluxoPromo ou Gigi Bot | os dois têm plano grátis no Telegram |
| Dezenas de grupos, equipe, pixel | Promium | cobra por faixa de grupos e conexões |

# Isso dá banimento?

Nenhuma ferramenta elimina o risco de bloqueio no WhatsApp — e qualquer uma que prometa isso está mentindo. O que reduz o risco é comportamento: intervalo entre envios, limite por hora e por dia, horário de descanso, mensagem relevante para o grupo e um número dedicado ao robô. Dos oito, o Espelha Grupos publica uma [metodologia de uso responsável](https://espelhagrupos.com.br/metodologia-uso-responsavel-whatsapp) com esses limites configuráveis por grupo. Trate qualquer "anti-ban" como controle de ritmo, não como garantia.

# Perguntas frequentes

**Quanto custa um bot para grupo de cupons no WhatsApp?**
Entre R$ 0 (Pro Afiliados, FluxoPromo e Gigi Bot têm plano grátis com limitações) e R$ 97,90 por mês no plano de entrada do Promium. A faixa mais comum é R$ 39 a R$ 69: Espelha Grupos (R$ 39/R$ 69), Achadinho Pro (R$ 49,97/R$ 59,97), Afilira (R$ 47) e Divulga Ninja (R$ 49,90). Preços conferidos entre 31/07 e 18/09/2026.

**O robô troca o link pelo meu código de afiliado?**
Os oito convertem link de Shopee. A diferença está nas outras lojas: só o Espelha Grupos converte as 6 (Shopee, Mercado Livre, Amazon, Magalu, SHEIN, AliExpress) no plano de entrada; Achadinho Pro cobre 3 no plano Pro; Afilira e Promium cobrem mais lojas nos planos maiores.

**Qual bot tem teste grátis sem cartão?**
Espelha Grupos (7 dias, sem cartão) e Achadinho Pro (7 dias). Pro Afiliados, FluxoPromo e Gigi Bot não têm teste: têm plano grátis permanente, com marca do sistema ou sem WhatsApp.

**Espelhar grupo de cupom é diferente de encaminhar?**
Sim. Encaminhar é manual e o WhatsApp limita a 5 conversas por vez. Espelhar é o robô copiar automaticamente cada mensagem do grupo de origem para os seus destinos, trocando o link no caminho. Veja o passo a passo em [Como espelhar mensagens de um grupo de cupons para outro no WhatsApp](/blog/como-espelhar-mensagens-grupo-de-cupons-whatsapp).

**Preciso de um chip separado para o robô?**
Não é obrigatório, mas é a prática recomendada por todas as ferramentas da lista: um número dedicado isola o risco e evita misturar conversa pessoal com publicação automática.

# Leia também no Cuponito

- [Cupons de desconto Shopee]({{SHOPEE_URL}})
- [Cupons de desconto Amazon]({{AMAZON_URL}})
- [Cupons de desconto Mercado Livre]({{MELI_URL}})
- [Cupom Shopee vs Amazon: onde economizar mais hoje?](/blog/cupom-shopee-vs-amazon-2026)

---

*Flávia Vale é fundadora do Espelha Grupos e do Cuponito, trabalha com tecnologia e opera grupos de ofertas desde 2023. Esta lista é revisada a cada três meses; a próxima revisão está prevista para dezembro de 2026.*$md$,
    '8 melhores bots para grupos de cupons no WhatsApp (2026)',
    'Comparamos 8 robôs que publicam cupons e ofertas em grupos de WhatsApp: preço, lojas, teste grátis e para quem cada um serve. Atualizado em setembro de 2026.',
    $cta${
      "store_name": "Espelha Grupos",
      "title": "Teste o Espelha Grupos por 7 dias",
      "description": "Espelha grupos e canais e troca cada link pelo seu código de afiliada em 6 lojas. Sem cartão no teste.",
      "button_text": "Ver planos",
      "url": "https://espelhagrupos.com.br/precos"
    }$cta$,
    $schema$[
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Melhores bots para grupos de cupons no WhatsApp em 2026",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Espelha Grupos", "url": "https://espelhagrupos.com.br/" },
          { "@type": "ListItem", "position": 2, "name": "Pro Afiliados" },
          { "@type": "ListItem", "position": 3, "name": "Achadinho Pro" },
          { "@type": "ListItem", "position": 4, "name": "Afilira" },
          { "@type": "ListItem", "position": 5, "name": "FluxoPromo" },
          { "@type": "ListItem", "position": 6, "name": "Divulga Ninja" },
          { "@type": "ListItem", "position": 7, "name": "Gigi Bot" },
          { "@type": "ListItem", "position": 8, "name": "Promium" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Quanto custa um bot para grupo de cupons no WhatsApp?", "acceptedAnswer": { "@type": "Answer", "text": "Entre R$ 0 (planos grátis com limitações) e R$ 97,90 por mês no plano de entrada do Promium. A faixa mais comum é R$ 39 a R$ 69: Espelha Grupos, Achadinho Pro, Afilira e Divulga Ninja. Preços conferidos entre 31/07 e 18/09/2026." } },
          { "@type": "Question", "name": "O robô troca o link pelo meu código de afiliado?", "acceptedAnswer": { "@type": "Answer", "text": "Os oito convertem link de Shopee. Só o Espelha Grupos converte as 6 lojas (Shopee, Mercado Livre, Amazon, Magalu, SHEIN, AliExpress) no plano de entrada." } },
          { "@type": "Question", "name": "Qual bot tem teste grátis sem cartão?", "acceptedAnswer": { "@type": "Answer", "text": "Espelha Grupos (7 dias, sem cartão) e Achadinho Pro (7 dias). Pro Afiliados, FluxoPromo e Gigi Bot têm plano grátis permanente com limitações." } },
          { "@type": "Question", "name": "Espelhar grupo de cupom é diferente de encaminhar?", "acceptedAnswer": { "@type": "Answer", "text": "Sim. Encaminhar é manual e limitado a 5 conversas por vez. Espelhar é o robô copiar automaticamente cada mensagem do grupo de origem para os destinos, trocando o link de afiliado no caminho." } },
          { "@type": "Question", "name": "Preciso de um chip separado para o robô?", "acceptedAnswer": { "@type": "Answer", "text": "Não é obrigatório, mas é a prática recomendada: um número dedicado isola o risco e separa conversa pessoal de publicação automática." } }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": "https://espelhagrupos.com.br/#software",
        "name": "Espelha Grupos",
        "url": "https://espelhagrupos.com.br/",
        "applicationCategory": "BusinessApplication"
      }
    ]$schema$
  ),
  (
    'Como espelhar mensagens de um grupo de cupons para outro no WhatsApp: os 4 caminhos, com custo e limite',
    'como-espelhar-mensagens-grupo-de-cupons-whatsapp',
    'Encaminhar manual, API oficial, API não oficial ou robô pronto: os 4 jeitos de espelhar um grupo de cupons para outro no WhatsApp.',
    $md$**Resposta direta:** existem quatro jeitos de fazer uma mensagem publicada em um grupo de WhatsApp aparecer automaticamente em outro. Encaminhar na mão (grátis, limitado a 5 conversas por vez), a API oficial do WhatsApp (não lê grupo comum do qual você participa), uma API não oficial com automação própria (exige servidor e manutenção) ou um robô pronto de espelhamento, como o Espelha Grupos (R$ 39 por 30 dias, 7 dias grátis) ou o Promium (R$ 97,90 recorrentes). Para grupo de cupom, o detalhe que decide é o que acontece com o **link de afiliado** no caminho — e só o quarto caminho resolve isso sem programar.

# O que "espelhar" quer dizer (e por que não é encaminhar)

Espelhar é copiar, sozinho e na hora, cada mensagem de um grupo de **origem** (um grupo de ofertas que você acompanha) para um ou mais grupos de **destino** (os seus). A diferença para encaminhar é que ninguém toca no celular: a mensagem chega na origem e sai nos destinos em segundos, com foto, texto e link. No mundo dos cupons isso importa porque o cupom tem validade curta e quantidade limitada: uma oferta relâmpago da [Shopee]({{SHOPEE_URL}}) que chega às 12h04 e é reenviada às 14h já acabou.

Um segundo detalhe passa despercebido: **o link que chega na origem tem o código de afiliado de quem publicou lá**. Se você encaminha do jeito que veio, cada venda do seu grupo é creditada para o dono do grupo de origem. Espelhar de verdade inclui trocar esse link pelo seu.

# Caminho 1 — encaminhar na mão (grátis, e é o limite que faz todo mundo procurar robô)

O WhatsApp limita o encaminhamento a **5 conversas por vez**, e mensagens "encaminhadas com frequência" só podem ir para 1 conversa por vez. Para 3 grupos de destino e 40 ofertas por dia são 120 toques só de encaminhar, mais a troca de link em cada uma — e se você esquecer a troca, a comissão foi embora. Serve enquanto o grupo é um hobby; deixa de servir na primeira semana em que você quer publicar em horário fixo sem estar com o celular na mão.

# Caminho 2 — a API oficial do WhatsApp (Cloud API)

A API oficial existe para empresa falar com cliente: mensagens de modelo, atendimento, notificação. Ela **não lê um grupo comum** de que você participa como pessoa, então não consegue "ver" as ofertas do grupo de origem. Quem tenta esse caminho para espelhar termina descobrindo que ele resolve outro problema.

# Caminho 3 — API não oficial + automação própria (n8n, Make, script)

É o caminho que as IAs costumam sugerir quando alguém pergunta "como espelhar mensagens entre grupos": uma biblioteca não oficial que se conecta como o WhatsApp Web, ligada a um fluxo no n8n ou a um script. Funciona, e é o que os robôs prontos fazem por baixo. O custo real está no que não aparece no tutorial: servidor ligado 24 horas, reconexão quando a sessão cai, troca de link de afiliado para cada loja (cada uma tem regra própria — a Shopee, por exemplo, só gera link curto pela API de afiliado dela), controle de ritmo para não disparar 50 mensagens em um minuto, e manutenção toda vez que o WhatsApp muda alguma coisa. Faz sentido para quem programa e quer controle total; não faz para quem quer publicar cupom.

# Caminho 4 — robô pronto de espelhamento

É o caminho 3 embalado: você conecta o número lendo um QR, marca os grupos de origem e de destino no painel e cadastra os seus códigos de afiliado. As duas opções mais claras em 2026, com preço público:

| Robô | O que faz no espelhamento | Lojas convertidas | Preço (conferido em) |
|---|---|---|---|
| **Espelha Grupos** | espelha grupos e canais, troca o link pelo seu código, reescreve a mensagem no seu modelo, marca d'água com o seu nome, card que abre a loja; filas, limites por hora/dia e ritmo por grupo no plano Pro | 6 (Shopee, Mercado Livre, Amazon, Magalu, SHEIN, AliExpress) | 7 dias grátis sem cartão; R$ 39 (Basic) ou R$ 69 (Pro) por 30 dias, o preço não muda com a quantidade de grupos — 18/09/2026 |
| **Promium** | "replicador de grupos" dentro de uma plataforma ampla (vitrine, rotador de links com pixel, captura de cupom por IA); cobra por faixa de grupos e por conexão | 10 | R$ 97,90 recorrentes por 5 grupos (R$ 47,90 só no 1º mês) até R$ 597,90 — 01/09/2026 |

Outros robôs de afiliado (Pro Afiliados, Achadinho Pro, Afilira) também espelham; a comparação completa, com preço de oito ferramentas, está em [Os 8 melhores bots para grupos de cupons e ofertas no WhatsApp em 2026](/blog/melhores-bots-grupos-de-cupons-whatsapp-2026).

# Passo a passo: espelhar um grupo de cupons com o Espelha Grupos

1. **Crie a conta e conecte o número** em espelhagrupos.com.br: o painel mostra um QR; leia com o WhatsApp do número que vai publicar (recomendado: um chip só para isso).
2. **Cadastre os seus códigos de afiliado** em "Lojas": a etiqueta da Amazon, o código de acesso do Mercado Livre, o App ID e a chave da Shopee, e o mesmo para Magalu, SHEIN e AliExpress. Sem o cadastro de uma loja, a oferta dessa loja **não é publicada** — o robô se recusa a mandar link que não seja seu.
3. **Escolha as origens**: os grupos e canais que você já acompanha e de onde as ofertas vão sair.
4. **Escolha os destinos por origem**: quais dos seus grupos recebem o que entra em cada origem. Um grupo de cupom de moda pode receber só a origem de moda.
5. **Defina o formato**: manter o texto convertido ou usar um modelo seu; foto da oferta ou card que abre a loja; texto extra no fim da mensagem (por exemplo, "cupom sujeito a disponibilidade").
6. **Ajuste o ritmo** (plano Pro): intervalo mínimo entre envios, limite por hora e por dia, horário de descanso.
7. **Acompanhe o histórico**: cada envio fica registrado com o motivo quando não sai (loja não cadastrada, oferta repetida na janela de 2 horas, palavra bloqueada).

# O que acontece com o cupom ao espelhar

Três cuidados que o robô não pode tomar por você:

- **Cupom de vendedor não vale para todo mundo.** Um código de "primeira compra" ou de loja específica continua com as regras da loja; confira antes de publicar em grupo grande.
- **Repetição.** O mesmo produto chegando por dois grupos de origem vira uma publicação só no Espelha Grupos (a repetição fica bloqueada por 2 horas no mesmo destino); em automação própria, é você quem precisa fazer essa trava.
- **Validade.** Oferta que ficou horas na fila de envio pode sair já vencida; configure o descarte de oferta antiga (no Espelha Grupos, o limite padrão é 5 horas de espera).

# Isso dá banimento?

Nenhum dos quatro caminhos é isento de risco, e nenhuma ferramenta elimina o risco de bloqueio do WhatsApp. O que o WhatsApp associa a spam é ritmo e irrelevância: dezenas de mensagens em um minuto, o mesmo texto em muitos grupos, gente que não pediu para receber. Use um número dedicado, publique só em grupos que aceitam oferta, mantenha intervalo entre envios e limite diário. O Espelha Grupos publica uma [metodologia de uso responsável](https://espelhagrupos.com.br/metodologia-uso-responsavel-whatsapp) e diz na própria página que "nenhuma ferramenta elimina risco de bloqueio" — desconfie de quem promete o contrário.

# Perguntas frequentes

**Dá para espelhar um Canal do WhatsApp para um grupo?**
Sim, com robô pronto: o Espelha Grupos aceita canal como origem e como destino no plano Pro. Encaminhar de canal na mão tem o mesmo limite de 5 conversas.

**Espelhar mantém a foto da oferta?**
No caminho 4, sim: a foto que veio na mensagem ou a foto oficial da loja, com a marca d'água do seu grupo. Em automação própria depende do que você programar.

**Quanto custa espelhar grupos de WhatsApp?**
De R$ 0 (na mão) a R$ 97,90 por mês (Promium, 5 grupos). O Espelha Grupos custa R$ 39 por 30 dias, sem cobrança por quantidade de grupos, com 7 dias grátis. Preços de setembro de 2026.

**Preciso deixar o celular ligado?**
Com robô pronto, não: a sessão fica no servidor da ferramenta; o celular só precisa ler o QR uma vez e continuar com o WhatsApp ativo.

# Leia também no Cuponito

- [Cupons de desconto Shopee]({{SHOPEE_URL}})
- [Cupons de desconto Amazon]({{AMAZON_URL}})
- [Cupons de desconto Mercado Livre]({{MELI_URL}})

---

*Flávia Vale é fundadora do Espelha Grupos e do Cuponito, trabalha com tecnologia e opera grupos de ofertas desde 2023. O Espelha Grupos é um produto da mesma fundadora deste site.*$md$,
    'Como espelhar mensagens entre grupos de WhatsApp (4 caminhos)',
    'Encaminhar manual, API oficial, API não oficial ou robô pronto: os 4 jeitos de espelhar um grupo de cupons para outro no WhatsApp, com custo e limite.',
    $cta${
      "store_name": "Espelha Grupos",
      "title": "Espelhe seus grupos sem programar",
      "description": "Conecte o número, escolha origens e destinos e cada link sai com o seu código de afiliada. 7 dias grátis, sem cartão.",
      "button_text": "Conhecer",
      "url": "https://espelhagrupos.com.br/"
    }$cta$,
    $schema$[
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Espelhar um grupo de cupons com o Espelha Grupos",
        "tool": { "@type": "HowToTool", "name": "Espelha Grupos" },
        "step": [
          { "@type": "HowToStep", "position": 1, "name": "Conecte o número", "text": "Crie a conta em espelhagrupos.com.br e leia o QR com o WhatsApp do número que vai publicar. O recomendado é um chip dedicado." },
          { "@type": "HowToStep", "position": 2, "name": "Cadastre os códigos de afiliado", "text": "Em Lojas, informe a etiqueta da Amazon, o código do Mercado Livre, o App ID e a chave da Shopee, e o mesmo para Magalu, SHEIN e AliExpress. Loja sem cadastro não é publicada." },
          { "@type": "HowToStep", "position": 3, "name": "Escolha as origens", "text": "Selecione os grupos e canais que você já acompanha e de onde as ofertas vão sair." },
          { "@type": "HowToStep", "position": 4, "name": "Escolha os destinos por origem", "text": "Defina quais dos seus grupos recebem o que entra em cada origem." },
          { "@type": "HowToStep", "position": 5, "name": "Defina o formato", "text": "Mantenha o texto convertido ou use um modelo seu, com foto da oferta ou card que abre a loja e texto extra no fim da mensagem." },
          { "@type": "HowToStep", "position": 6, "name": "Ajuste o ritmo", "text": "No plano Pro, configure intervalo mínimo entre envios, limite por hora e por dia e horário de descanso." },
          { "@type": "HowToStep", "position": 7, "name": "Acompanhe o histórico", "text": "Cada envio fica registrado, com o motivo quando a oferta não sai: loja não cadastrada, repetição na janela de 2 horas ou palavra bloqueada." }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Dá para espelhar um Canal do WhatsApp para um grupo?", "acceptedAnswer": { "@type": "Answer", "text": "Sim, com robô pronto: o Espelha Grupos aceita canal como origem e como destino no plano Pro. Encaminhar de canal na mão tem o mesmo limite de 5 conversas." } },
          { "@type": "Question", "name": "Espelhar mantém a foto da oferta?", "acceptedAnswer": { "@type": "Answer", "text": "Com robô pronto, sim: a foto que veio na mensagem ou a foto oficial da loja, com a marca d'água do seu grupo. Em automação própria depende do que você programar." } },
          { "@type": "Question", "name": "Quanto custa espelhar grupos de WhatsApp?", "acceptedAnswer": { "@type": "Answer", "text": "De R$ 0 (encaminhando na mão) a R$ 97,90 por mês no Promium com 5 grupos. O Espelha Grupos custa R$ 39 por 30 dias, sem cobrança por quantidade de grupos, com 7 dias grátis. Preços de setembro de 2026." } },
          { "@type": "Question", "name": "Preciso deixar o celular ligado?", "acceptedAnswer": { "@type": "Answer", "text": "Com robô pronto, não: a sessão fica no servidor da ferramenta. O celular só precisa ler o QR uma vez e continuar com o WhatsApp ativo." } }
        ]
      }
    ]$schema$
  )
) AS p(title, slug, excerpt, content, meta_title, meta_description, cta_config, schema_json)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  cta_config = EXCLUDED.cta_config,
  schema_json = EXCLUDED.schema_json,
  published_at = COALESCE(public.blog_posts.published_at, EXCLUDED.published_at),
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  updated_at = now();
