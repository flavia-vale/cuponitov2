-- Próximas apostas do plano de crescimento (docs/plano-crescimento-agressivo-2026-11-12.md, 7.5 e 7.6).
--
-- Dados: Planejador de Palavras-chave do Google com números exatos, Brasil, nov/2025 a out/2026
-- (média mensal; entre parênteses, novembro de 2025):
--   celular em promoção 90.500 (110.000) · celular baratos 90.500 · celular bom e barato 49.500
--     · celular samsung barato 22.200 · celular samsung promoção 8.100 · motorola em promoção 2.400
--   notebook em promoção 22.200 (27.100) · notebook dell 2.900 · notebook gamer 1.000 · notebook i5 1.000
--   ps5 promoção 9.900 (14.800; +124% no ano) · playstation 5 promoção 2.900
--   micro ondas promoção 18.100 (27.100) · microondas 220v 2.400 · microondas 30 litros 1.600
--   máquina de lavar roupa promoção 12.100 · maquina de lavar em promoção 9.900 · lava e seca 6.600 (+50%)
--   ventilador na promoção 8.100 (dez/25: 27.100) · ventilador promoção 4.400 (dez/25: 14.800)
--   maquiagem em promoção 4.400 (+50% no ano) · skincare promoção 590 (+129%)
--   brinquedos em promoção 3.600 (+128% em 3 meses; 4.400 em nov e dez)
--   sofá em promoção 12.100 (22.200) · sofa cama 1.300 · sofá retrátil 1.000
--   colchao de casal promoção 4.400 · colchão de solteiro promoção 3.600 · colchão queen 590
--   pneu em promoção 5.400 (9.900) · pneu aro 13 promoção 5.400 · pneu 175 70 r14 promoção 3.600
-- Respostas das IAs e oferta por dia no Espelha Grupos ainda não levantadas (pedidas na seção 7.8):
-- a Flávia mandou executar em 12/11. Página de ofertas sem oferta sai com noindex (regra do prerender).
--
-- Sofá, colchão e pneu ainda não têm grupo próprio (Promo Casa e Promo Auto): join_url NULL leva ao
-- grupo geral e mostra as ofertas dele filtradas pelos termos. Quando o grupo existir, basta pôr o
-- link e o nome no painel (Grupos do WhatsApp → Dados do grupo).

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, join_url,
   group_name, topics, offer_volume, page_type, offer_terms, sort_order, is_published)
VALUES
(
  'celulares',
  NULL,
  'Celular em Promoção: bom e barato | Cuponito',
  'Celular em promoção',
  'Celular em promoção e celular bom e barato: Samsung, Motorola e Xiaomi com o link da loja oficial. Como comparar e não cair em desconto falso na Black Friday.',
  'Esta página reúne as promoções de celular que saíram no Promo Celular, o grupo de WhatsApp do Cuponito só de celulares, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Celular na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. Celular é a busca de promoção mais feita no Google: "celular em promoção" tem cerca de **90 mil buscas por mês** e passa de 110 mil em novembro (Planejador de Palavras-chave do Google).

Antes de comprar:

1. **Anote o preço de hoje** do modelo e compare em comparadores com histórico (Buscapé, Zoom, Google Shopping). Se o preço subir em novembro e "cair" na Black Friday, o desconto é de mentira.
2. **Confira o modelo completo**: memória (128 GB, 256 GB), RAM e se é 4G ou 5G. Dois anúncios com o mesmo nome podem ser aparelhos diferentes.
3. **Compare o Pix com o parcelado**: o desconto costuma estar no Pix.
4. **Veja quem vende**: no marketplace, prefira a loja oficial da marca ou o próprio site, e confira a nota fiscal e a garantia no Brasil.

## Celular bom e barato: o que olhar

"Celular bom e barato" tem cerca de **50 mil buscas por mês**. Para não pagar pouco por um aparelho que fica lento:

- **Memória**: 128 GB é o mínimo confortável hoje; 64 GB enche rápido com fotos e WhatsApp.
- **RAM**: 4 GB para uso básico; 6 GB ou mais para quem usa muitos apps.
- **Atualizações**: aparelhos mais novos recebem atualização de sistema e de segurança por mais tempo. Prefira o modelo do ano a um topo de linha muito antigo.
- **Bateria e carregador**: confira se o carregador vem na caixa.

## Samsung, Motorola e Xiaomi em promoção

As marcas mais buscadas em promoção são **Samsung** ("celular samsung barato" tem cerca de 22 mil buscas por mês), **Motorola** e **Xiaomi**. Compare sempre o mesmo modelo e a mesma memória entre lojas.

## O que chega no Promo Celular

Celulares em promoção de Samsung, Motorola, Xiaomi e outras marcas, com o link da loja oficial. iPhone tem grupo próprio: [iPhone em promoção](/ofertas/iphone). Para saber mais do grupo, veja o [grupo de promoção de celular no WhatsApp](/grupo-whatsapp/celular).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada, nem Pix para "liberar" cupom. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.

Veja também o [grupo de promoção de PC gamer](/grupo-whatsapp/pc-gamer), a [TV em promoção](/ofertas/tv) e todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de celular no WhatsApp?', 'answer', 'Sim. O Promo Celular, do Cuponito, é um grupo de WhatsApp grátis só com promoções de celular, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Qual celular bom e barato comprar?', 'answer', 'Olhe primeiro a memória (128 GB ou mais), a RAM (4 GB para uso básico, 6 GB ou mais para muitos apps) e o ano do modelo, que define por quanto tempo ele recebe atualizações. Compare o mesmo modelo e a mesma memória entre lojas.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026, uma sexta-feira. O Cyber Monday é em 30 de novembro.'),
    jsonb_build_object('question', 'Como saber se a promoção de celular é real?', 'answer', 'Anote o preço do modelo antes e compare em comparadores com histórico de preço, como Buscapé, Zoom e Google Shopping. Se o preço subiu antes da promoção, o desconto é falso.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Celular é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-celular',
  'Promo Celular',
  'celulares',
  'cerca de 5 ofertas por dia',
  'offers',
  'celular,smartphone,galaxy,motorola,moto g,moto e,xiaomi,redmi,poco,realme,samsung a',
  70,
  true
),
(
  'notebook',
  NULL,
  'Notebook em Promoção: gamer, i5 e Ryzen | Cuponito',
  'Notebook em promoção',
  'Notebook em promoção: gamer, i5, i7 e Ryzen, Dell, Lenovo, Samsung e Acer, com o link da loja oficial. O que olhar antes de comprar na Black Friday.',
  'Esta página reúne as promoções de notebook que saíram no Promo Tech Nerd, o grupo de WhatsApp do Cuponito de PC gamer, peças, notebook, videogame e TV, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Notebook na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. "Notebook em promoção" tem cerca de **22 mil buscas por mês** no Google e passa de 27 mil em novembro (Planejador de Palavras-chave do Google). Depois, a procura volta com a **volta às aulas**, em janeiro e fevereiro.

Antes de comprar:

1. **Compare pela configuração, não pelo nome**: processador, memória RAM, SSD e tela. Notebooks com o mesmo nome mudam de configuração.
2. **Anote o preço de hoje** e compare em comparadores com histórico. Se o preço subir antes da Black Friday, o desconto é falso.
3. **Compare o Pix com o parcelado** e confira a garantia.

## Qual notebook escolher

| Uso | Processador | RAM | Armazenamento |
|---|---|---|---|
| Estudo, internet e escritório | Intel Core i3/i5 ou Ryzen 3/5 | 8 GB | SSD de 256 GB |
| Trabalho pesado, muitos programas | Core i5/i7 ou Ryzen 5/7 | 16 GB | SSD de 512 GB |
| Jogos | Core i5/i7 ou Ryzen 5/7 com placa de vídeo dedicada (RTX) | 16 GB | SSD de 512 GB |

- **SSD**: evite notebook só com HD; o SSD é o que mais deixa o computador rápido.
- **Tela**: Full HD (1920 x 1080) é o padrão hoje; telas HD são mais baratas e menos nítidas.
- **Notebook gamer**: confira a placa de vídeo pelo modelo (ex.: RTX 3050, RTX 4060), não só pela marca.

## Dell, Lenovo, Samsung e Acer

As marcas mais buscadas em promoção, com a Dell na frente. Compare sempre a mesma configuração entre marcas e lojas.

## O que mais chega no Promo Tech Nerd

Além de notebook: [PC gamer, peças e games](/grupo-whatsapp/pc-gamer), [PS5 em promoção](/ofertas/ps5), monitor e [TV em promoção](/ofertas/tv). São cerca de 200 ofertas por dia: vale silenciar o grupo e olhar quando quiser.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.

Veja também o [celular em promoção](/ofertas/celulares) e todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de notebook no WhatsApp?', 'answer', 'Sim. O Promo Tech Nerd, do Cuponito, é um grupo de WhatsApp grátis com promoções de notebook, PC gamer, peças, videogame e TV, cerca de 200 por dia, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Qual notebook comprar para estudar?', 'answer', 'Para estudo, internet e escritório, um notebook com Intel Core i3 ou i5 (ou Ryzen 3 ou 5), 8 GB de RAM e SSD de 256 GB costuma bastar. Evite modelos só com HD.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026, uma sexta-feira. O Cyber Monday é em 30 de novembro.'),
    jsonb_build_object('question', 'Como saber se o notebook em promoção é bom?', 'answer', 'Compare pela configuração completa (processador, RAM, SSD e tela) e não pelo nome do modelo, e veja o histórico de preço em comparadores como Buscapé, Zoom e Google Shopping.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Tech Nerd é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-tech',
  'Promo Tech Nerd',
  'PC gamer, peças, notebook, games e TV',
  'cerca de 200 ofertas por dia',
  'offers',
  'notebook,laptop,chromebook,macbook,ultrabook',
  71,
  true
),
(
  'ps5',
  NULL,
  'PS5 em Promoção: console e jogos | Cuponito',
  'PS5 em promoção',
  'PS5 em promoção: PlayStation 5, PS5 Slim, Pro, controle DualSense e jogos, com o link da loja oficial. Como saber se o preço da Black Friday é bom.',
  'Esta página reúne as promoções de PS5 que saíram no Promo Tech Nerd, o grupo de WhatsApp do Cuponito de PC gamer, peças, notebook, videogame e TV, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## PS5 na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. A busca "ps5 promoção" tem cerca de **10 mil buscas por mês** no Google, **mais que dobrou em um ano** e chega a 15 mil em novembro (Planejador de Palavras-chave do Google).

Antes de comprar:

1. **Confira a versão**: PS5 com leitor de disco ou Edição Digital (sem leitor), Slim ou Pro. O preço muda bastante entre elas.
2. **Veja o que vem junto**: kits com jogo ou segundo controle às vezes saem mais baratos que comprar separado.
3. **Anote o preço de hoje** e compare em comparadores com histórico. Se o preço subir antes da Black Friday, o desconto é falso.
4. **Prefira a loja oficial ou o vendedor oficial** no marketplace, com nota fiscal e garantia no Brasil.

## Jogos e controle DualSense

Jogos e o controle **DualSense** entram em promoção com frequência, inclusive fora da Black Friday. Jogo em mídia física pode ser revendido; o digital, não. O PS5 Edição Digital só roda jogo digital.

## O que mais chega no Promo Tech Nerd

Além de PS5: [PC gamer, peças e games](/grupo-whatsapp/pc-gamer), [notebook em promoção](/ofertas/notebook), monitor e [TV em promoção](/ofertas/tv). São cerca de 200 ofertas por dia.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.

Veja também todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de PS5 no WhatsApp?', 'answer', 'Sim. O Promo Tech Nerd, do Cuponito, é um grupo de WhatsApp grátis com promoções de PS5, jogos, PC gamer, notebook e TV, cerca de 200 por dia, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'PS5 com leitor ou Edição Digital?', 'answer', 'A Edição Digital custa menos, mas só roda jogos comprados na loja digital. Com leitor, dá para comprar jogo físico, que costuma entrar em promoção e pode ser revendido.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026, uma sexta-feira. O Cyber Monday é em 30 de novembro.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Tech Nerd é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-tech',
  'Promo Tech Nerd',
  'PC gamer, peças, notebook, games e TV',
  'cerca de 200 ofertas por dia',
  'offers',
  'ps5,playstation 5,playstation5,dualsense,ps vr2',
  72,
  true
),
(
  'microondas',
  NULL,
  'Micro-ondas em Promoção: 20 a 34 litros | Cuponito',
  'Micro-ondas em promoção',
  'Micro-ondas em promoção de 20, 30 e 34 litros, 110 V e 220 V, de Electrolux, Panasonic, Philco e outras marcas, com o link da loja oficial.',
  'Esta página reúne as promoções de micro-ondas que saíram no Promo Eletrodomésticos, o grupo de WhatsApp do Cuponito de geladeira, ar-condicionado, micro-ondas, máquina de lavar e outros eletrodomésticos, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Micro-ondas na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. "Micro ondas promoção" tem cerca de **18 mil buscas por mês** no Google e passa de 27 mil em novembro (Planejador de Palavras-chave do Google).

Antes de comprar:

1. **Confira a voltagem** (110 V ou 220 V): é a busca mais comum depois do preço, e o aparelho errado não liga na tomada da sua casa.
2. **Anote o preço de hoje** e compare em comparadores com histórico. Se o preço subir antes da Black Friday, o desconto é falso.
3. **Some o frete** e compare o Pix com o parcelado.

## Qual tamanho de micro-ondas

| Capacidade | Para quem |
|---|---|
| 20 a 21 litros | 1 ou 2 pessoas, esquentar comida |
| 25 a 30 litros | família, pratos maiores |
| 32 litros ou mais | família grande ou quem cozinha no micro-ondas |

Meça o espaço antes: o micro-ondas precisa de alguns centímetros de folga nas laterais e atrás para ventilar. Os **espelhados** e com **função grill** costumam custar um pouco mais.

## O que mais chega no Promo Eletrodomésticos

Além de micro-ondas: [geladeira](/ofertas/geladeira), [máquina de lavar](/ofertas/maquina-de-lavar), [ar-condicionado](/ofertas/ar-condicionado), [ventilador](/ofertas/ventilador) e air fryer. São cerca de 30 ofertas por dia.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.

Veja também os [cupons da Casas Bahia](/desconto/cupom-desconto-casas-bahia) e todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de eletrodomésticos no WhatsApp?', 'answer', 'Sim. O Promo Eletrodomésticos, do Cuponito, é um grupo de WhatsApp grátis com promoções de micro-ondas, geladeira, máquina de lavar, ar-condicionado e outros eletrodomésticos, cerca de 30 por dia, com o link da loja oficial.'),
    jsonb_build_object('question', 'Qual o melhor tamanho de micro-ondas?', 'answer', 'De 20 a 21 litros para 1 ou 2 pessoas, de 25 a 30 litros para família e 32 litros ou mais para família grande ou para quem cozinha no micro-ondas.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026, uma sexta-feira.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Eletrodomésticos é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-eletrodomesticos',
  'Promo Eletrodomésticos',
  'geladeira, micro-ondas, máquina de lavar, ar-condicionado e eletrodomésticos',
  'cerca de 30 ofertas por dia',
  'offers',
  'micro-ondas,microondas,micro ondas',
  73,
  true
),
(
  'maquina-de-lavar',
  NULL,
  'Máquina de Lavar em Promoção: lava e seca | Cuponito',
  'Máquina de lavar em promoção',
  'Máquina de lavar roupa em promoção e lava e seca: 12 kg, 15 kg, Brastemp, Electrolux, Consul e Samsung, com o link da loja oficial. Qual capacidade escolher.',
  'Esta página reúne as promoções de máquina de lavar que saíram no Promo Eletrodomésticos, o grupo de WhatsApp do Cuponito de geladeira, ar-condicionado, micro-ondas, máquina de lavar e outros eletrodomésticos, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Máquina de lavar na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. As buscas por máquina de lavar em promoção somam mais de **27 mil por mês** no Google ("máquina de lavar roupa promoção", "maquina de lavar em promoção" e "maquina de lavar promoção"), e a de **lava e seca** cresceu 50% em um ano (Planejador de Palavras-chave do Google).

Antes de comprar:

1. **Meça o espaço e a porta** por onde a máquina vai passar.
2. **Confira a voltagem** (110 V ou 220 V) e a **etiqueta de consumo** do Inmetro (energia e água).
3. **Anote o preço de hoje** e compare em comparadores com histórico. Se o preço subir antes da Black Friday, o desconto é falso.
4. **Some o frete e a instalação**, se houver.

## Qual capacidade escolher

| Capacidade | Para quem |
|---|---|
| até 11 kg | 1 ou 2 pessoas |
| 12 kg | 3 ou 4 pessoas (a mais procurada) |
| 13 a 15 kg | família grande, edredom e cobertor |
| 17 kg ou mais | quem lava muito volume de uma vez |

## Lava e seca ou só lavadora?

A **lava e seca** dispensa varal e economiza espaço, mas custa mais e a secagem gasta energia. A capacidade de secar é **menor que a de lavar** (uma 11 kg costuma secar 7 kg): confira os dois números no anúncio. **Abertura frontal** gasta menos água; **abertura superior** costuma ser mais barata.

## O que mais chega no Promo Eletrodomésticos

Além de máquina de lavar: [geladeira](/ofertas/geladeira), [micro-ondas](/ofertas/microondas), [ar-condicionado](/ofertas/ar-condicionado), [ventilador](/ofertas/ventilador) e air fryer. São cerca de 30 ofertas por dia.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.

Veja também os [cupons da Casas Bahia](/desconto/cupom-desconto-casas-bahia) e todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de máquina de lavar no WhatsApp?', 'answer', 'Sim. O Promo Eletrodomésticos, do Cuponito, é um grupo de WhatsApp grátis com promoções de máquina de lavar, geladeira, micro-ondas, ar-condicionado e outros eletrodomésticos, cerca de 30 por dia, com o link da loja oficial.'),
    jsonb_build_object('question', 'Qual o tamanho certo de máquina de lavar?', 'answer', 'Até 11 kg para 1 ou 2 pessoas, 12 kg para 3 ou 4 pessoas e de 13 a 15 kg para família grande ou para lavar edredom e cobertor.'),
    jsonb_build_object('question', 'Lava e seca vale a pena?', 'answer', 'Vale para quem não tem varal ou espaço. Custa mais, a secagem gasta energia e a capacidade de secar é menor que a de lavar: confira os dois números no anúncio.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Eletrodomésticos é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-eletrodomesticos',
  'Promo Eletrodomésticos',
  'geladeira, micro-ondas, máquina de lavar, ar-condicionado e eletrodomésticos',
  'cerca de 30 ofertas por dia',
  'offers',
  'maquina de lavar,lavadora,lava e seca,lava-e-seca,tanquinho',
  74,
  true
),
(
  'ventilador',
  NULL,
  'Ventilador em Promoção: coluna, mesa e teto | Cuponito',
  'Ventilador em promoção',
  'Ventilador em promoção: de coluna, de mesa, de teto e circulador, Arno, Mondial e outras marcas, com o link da loja oficial. Qual escolher para o verão.',
  'Esta página reúne as promoções de ventilador que saíram no Promo Eletrodomésticos, o grupo de WhatsApp do Cuponito de geladeira, ar-condicionado, ventilador e outros eletrodomésticos, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Ventilador no verão: a procura triplica em dezembro

A busca "ventilador na promoção" tem cerca de **8 mil por mês** no Google, mas chega a **27 mil em dezembro**, com o calor (Planejador de Palavras-chave do Google). Quem compra antes do pico pega o preço da Black Friday, em **27 de novembro de 2026**, e mais estoque.

## Qual ventilador escolher

- **De coluna**: alcança mais longe e fica na altura de quem está sentado ou deitado. O mais comum para sala e quarto.
- **De mesa**: menor e mais barato, bom para escritório e quarto pequeno.
- **De parede**: libera o chão; precisa de instalação.
- **De teto**: ventila o cômodo inteiro e muitos vêm com luminária; precisa de instalação e de pé-direito adequado.
- **Circulador**: movimenta o ar do ambiente todo, mais silencioso.

Confira o **tamanho da hélice** (30, 40 ou 50 cm: quanto maior, mais vento), o **número de pás**, o **ruído** e a **voltagem**. Ventilador gasta bem menos energia que ar-condicionado.

## O que mais chega no Promo Eletrodomésticos

Além de ventilador: [ar-condicionado em promoção](/ofertas/ar-condicionado), [geladeira](/ofertas/geladeira), [micro-ondas](/ofertas/microondas) e [máquina de lavar](/ofertas/maquina-de-lavar). São cerca de 30 ofertas por dia.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.

Veja também todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de ventilador e ar-condicionado no WhatsApp?', 'answer', 'Sim. O Promo Eletrodomésticos, do Cuponito, é um grupo de WhatsApp grátis com promoções de ventilador, ar-condicionado, geladeira e outros eletrodomésticos, cerca de 30 por dia, com o link da loja oficial.'),
    jsonb_build_object('question', 'Quando o ventilador fica mais barato?', 'answer', 'A procura por ventilador triplica em dezembro, com o calor. Comprar antes, na Black Friday de 27 de novembro, costuma garantir preço e estoque.'),
    jsonb_build_object('question', 'Ventilador de coluna ou de mesa?', 'answer', 'O de coluna alcança mais longe e é o mais usado em sala e quarto. O de mesa é menor e mais barato, bom para escritório e quarto pequeno.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Eletrodomésticos é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-eletrodomesticos',
  'Promo Eletrodomésticos',
  'geladeira, ar-condicionado, ventilador e eletrodomésticos',
  'cerca de 30 ofertas por dia',
  'offers',
  'ventilador,circulador de ar',
  75,
  true
),
(
  'maquiagem',
  NULL,
  'Maquiagem em Promoção e Skincare | Cuponito',
  'Maquiagem em promoção',
  'Maquiagem em promoção: base, batom, máscara de cílios, paleta e skincare das marcas nacionais e importadas, com o link da loja oficial. Grupo grátis.',
  'Esta página reúne as promoções de maquiagem e beleza que saíram no Promo Salão, o grupo de WhatsApp do Cuponito de beleza, unha e salão, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Maquiagem em promoção: a busca que mais cresce em beleza

"Maquiagem em promoção" tem cerca de **4,4 mil buscas por mês** no Google, **50% a mais que há um ano**, e chega a 6,6 mil em novembro. "Skincare promoção" mais que dobrou no mesmo período (Planejador de Palavras-chave do Google).

## Como saber se a promoção de maquiagem é boa

1. **Compare pelo preço por ml ou por grama**: kits e tamanhos diferentes enganam.
2. **Confira a validade**: maquiagem em promoção às vezes está perto de vencer. O prazo fica na embalagem ou no anúncio.
3. **Compre na loja oficial da marca ou em loja autorizada**: maquiagem falsificada é comum em marketplace.
4. **Veja a cor pelo código do tom**, não só pela foto.

## Black Friday e Natal

A Black Friday é em **27 de novembro de 2026**. Kits de maquiagem e de skincare também são presente comum no Natal: comprar na Black Friday costuma sair mais barato que em dezembro.

## O que chega no Promo Salão

Maquiagem, skincare, esmaltes e materiais de unha e salão. Para manicure, veja o [grupo de manicure no WhatsApp](/grupo-whatsapp/manicure). Perfume tem grupo próprio: [perfume em promoção](/ofertas/perfume).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.

Veja também todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de maquiagem no WhatsApp?', 'answer', 'Sim. O Promo Salão, do Cuponito, é um grupo de WhatsApp grátis com promoções de maquiagem, skincare, esmaltes e materiais de salão, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Como saber se a maquiagem em promoção é original?', 'answer', 'Compre na loja oficial da marca ou em loja autorizada, desconfie de preço muito abaixo do normal e confira a validade e o lote na embalagem.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026, uma sexta-feira.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Salão é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-salao',
  'Promo Salão',
  'maquiagem, skincare, unha e salão',
  NULL,
  'offers',
  'maquiagem,batom,rimel,mascara de cilios,paleta,corretivo,blush,iluminador,po compacto,base liquida,skincare,serum,hidratante facial,protetor solar',
  76,
  true
),
(
  'brinquedos',
  NULL,
  'Brinquedos em Promoção: presentes de Natal | Cuponito',
  'Brinquedos em promoção',
  'Brinquedos em promoção para o Natal: Lego, bonecas, carrinhos, jogos e brinquedos educativos, com o link da loja oficial. Como escolher por idade.',
  'Esta página reúne as promoções de brinquedos que saíram no Promo Bebês, o grupo de WhatsApp do Cuponito de fraldas, produtos para bebês e brinquedos, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Brinquedos para o Natal: compre antes de dezembro

"Brinquedos em promoção" tem cerca de **3,6 mil buscas por mês** no Google e mais que dobrou nos últimos 3 meses, com o pico em **novembro e dezembro** (Planejador de Palavras-chave do Google). A Black Friday, em **27 de novembro de 2026**, é a melhor data para comprar o presente de Natal: em dezembro, o preço sobe e o estoque dos mais procurados acaba.

## Como escolher o brinquedo por idade

- **Confira a faixa etária** na embalagem: brinquedo com peças pequenas não é para menores de 3 anos.
- **Selo do Inmetro**: obrigatório em brinquedo vendido no Brasil. Desconfie de anúncio sem ele.
- **Pilhas**: veja se vêm na caixa.

## Como saber se a promoção de brinquedo é boa

1. **Anote o preço de hoje** do brinquedo e compare em comparadores com histórico. Se subir antes da Black Friday, o desconto é falso.
2. **Compare o mesmo código** do produto (Lego e bonecas têm número do conjunto).
3. **Some o frete** e confira o prazo de entrega antes do Natal.

## O que chega no Promo Bebês

Brinquedos, [fraldas em promoção](/ofertas/fraldas) e produtos para bebês e crianças, com o link da loja oficial.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.

Veja também todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de brinquedos no WhatsApp?', 'answer', 'Sim. O Promo Bebês, do Cuponito, é um grupo de WhatsApp grátis com promoções de brinquedos, fraldas e produtos para bebês e crianças, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Quando comprar brinquedo de Natal mais barato?', 'answer', 'Na Black Friday, em 27 de novembro de 2026. Em dezembro o preço costuma subir e os brinquedos mais procurados acabam.'),
    jsonb_build_object('question', 'O que conferir antes de comprar um brinquedo?', 'answer', 'A faixa etária na embalagem, o selo do Inmetro, se as pilhas vêm na caixa e o prazo de entrega antes do Natal.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Bebês é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-bebes',
  'Promo Bebês',
  'fraldas, produtos para bebês e brinquedos',
  NULL,
  'offers',
  'brinquedo,lego,boneca,hot wheels,pelucia,quebra-cabeca,massinha,jogo de tabuleiro,playmobil,barbie',
  77,
  true
),
(
  'sofa',
  NULL,
  'Sofá em Promoção: retrátil e de canto | Cuponito',
  'Sofá em promoção',
  'Sofá em promoção: retrátil, reclinável, de canto, sofá-cama, 2 e 3 lugares, com o link da loja oficial. Como medir e o que conferir antes de comprar.',
  'Esta página reúne as promoções de sofá que saíram nos grupos de WhatsApp do Cuponito, sempre com o preço do momento e o link da loja oficial. Os grupos são grátis e só os administradores postam.',
  $md$
## Sofá na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. "Sofá em promoção" tem cerca de **12 mil buscas por mês** no Google e chega a **22 mil em novembro** (Planejador de Palavras-chave do Google): é um dos móveis mais comprados na data.

Antes de comprar:

1. **Meça a sala e a porta**: largura, profundidade e altura do sofá, e a largura da porta, do corredor e do elevador por onde ele vai passar.
2. **Confira o frete e o prazo**: móvel grande tem frete caro e prazo longo. Some o frete ao comparar ofertas.
3. **Veja se vem montado** ou se a montagem é cobrada à parte.
4. **Anote o preço de hoje** e compare em comparadores com histórico. Se o preço subir antes da Black Friday, o desconto é falso.

## Qual sofá escolher

- **Retrátil e reclinável**: o assento avança e o encosto inclina. Bom para ver TV; precisa de espaço na frente (meça com ele aberto).
- **De canto (em L)**: mais lugares no mesmo espaço; confira de que lado fica o canto.
- **Sofá-cama**: para quem recebe visita e não tem quarto de hóspedes.
- **2 e 3 lugares**: o conjunto mais vendido para salas pequenas e médias.

**Tecido**: suede e veludo são macios e mais difíceis de limpar; linho e tecidos impermeabilizados são práticos para quem tem criança ou pet; couro sintético é fácil de limpar e esquenta mais.

## Receba as promoções de casa no WhatsApp

As promoções de sofá, colchão e móveis saem nos grupos do Cuponito, com o link da loja oficial (Casas Bahia, Magalu, Mercado Livre, Amazon e outras). Veja também o [colchão em promoção](/ofertas/colchao), a [geladeira em promoção](/ofertas/geladeira) e a [TV em promoção](/ofertas/tv).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.

Veja também os [cupons da Casas Bahia](/desconto/cupom-desconto-casas-bahia) e todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de móveis no WhatsApp?', 'answer', 'Sim. As promoções de sofá, colchão e móveis saem nos grupos de WhatsApp grátis do Cuponito, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Como medir o sofá antes de comprar?', 'answer', 'Meça a largura, a profundidade e a altura do sofá e compare com a sala e com a largura da porta, do corredor e do elevador. No retrátil, meça com o assento aberto.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026, uma sexta-feira.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. Os grupos do Cuponito são grátis e só os administradores postam.')
  ),
  NULL,
  NULL,
  NULL,
  NULL,
  'offers',
  'sofa,sofas,sofa-cama,sofa cama,poltrona,chaise,recamier',
  78,
  true
),
(
  'colchao',
  NULL,
  'Colchão de Casal e Solteiro em Promoção | Cuponito',
  'Colchão de casal e de solteiro em promoção',
  'Colchão de casal, de solteiro e queen em promoção, com mola ou espuma, e cama box, com o link da loja oficial. Como escolher a densidade certa.',
  'Esta página reúne as promoções de colchão que saíram nos grupos de WhatsApp do Cuponito, sempre com o preço do momento e o link da loja oficial. Os grupos são grátis e só os administradores postam.',
  $md$
## Colchão na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. As buscas mais feitas são **"colchão de casal promoção"** (cerca de 4,4 mil por mês) e **"colchão de solteiro promoção"** (cerca de 3,6 mil), segundo o Planejador de Palavras-chave do Google. Quem busca já sabe o tamanho: comece por ele.

## Tamanhos de colchão

| Tamanho | Medida aproximada |
|---|---|
| Solteiro | 88 x 188 cm |
| Viúvo | 128 x 188 cm |
| Casal | 138 x 188 cm |
| Queen | 158 x 198 cm |
| King | 193 x 203 cm |

Confira a medida no anúncio e compare com a cama ou o box que você já tem.

## Mola ou espuma? A densidade certa

- **Espuma**: escolha a **densidade pelo peso** de quem dorme. O selo do **Inmetro** e a etiqueta trazem a tabela de peso por densidade (D28, D33, D45…). Densidade baixa para o peso afunda rápido.
- **Molas ensacadas**: cada mola trabalha sozinha, e um não sente o outro se mexer. Costumam custar mais.
- **Molas Bonnel** (interligadas): mais baratas e firmes; o movimento passa de um lado para o outro.

## O que conferir antes de comprar

1. **A densidade ou o tipo de mola**, não só o nome do modelo.
2. **Se é só o colchão ou o conjunto com box**: o preço muda muito.
3. **O frete e o prazo**, e se a loja aceita troca.
4. **O preço de hoje**, comparado em comparadores com histórico.

## Receba as promoções de casa no WhatsApp

As promoções de colchão, sofá e móveis saem nos grupos do Cuponito, com o link da loja oficial. Veja também o [sofá em promoção](/ofertas/sofa) e a [geladeira em promoção](/ofertas/geladeira).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.

Veja também todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Qual a medida do colchão de casal?', 'answer', 'O colchão de casal padrão mede cerca de 138 x 188 cm. O queen mede cerca de 158 x 198 cm e o king, cerca de 193 x 203 cm. Confira sempre a medida no anúncio.'),
    jsonb_build_object('question', 'Como escolher a densidade do colchão de espuma?', 'answer', 'Pelo peso de quem dorme: a etiqueta do Inmetro traz a tabela de peso por densidade. Densidade baixa para o peso faz o colchão afundar rápido.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026, uma sexta-feira.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. Os grupos do Cuponito são grátis e só os administradores postam.')
  ),
  NULL,
  NULL,
  NULL,
  NULL,
  'offers',
  'colchao,colchoes,cama box,box casal,box solteiro,box queen,box king',
  79,
  true
),
(
  'pneu',
  NULL,
  'Pneu em Promoção: aro 13, 14, 15 e 16 | Cuponito',
  'Pneu em promoção',
  'Pneu em promoção aro 13, 14, 15 e 16: 175/70 R14, 185/65 R15 e outras medidas, com o link da loja oficial. Como ler a medida e o que conferir.',
  'Esta página reúne as promoções de pneu que saíram nos grupos de WhatsApp do Cuponito, sempre com o preço do momento e o link da loja oficial. Os grupos são grátis e só os administradores postam.',
  $md$
## Pneu em promoção: comece pela medida

Quem procura pneu já sabe a medida: "pneu aro 13 promoção" tem cerca de **5,4 mil buscas por mês** no Google, igual a "pneu em promoção", e "pneu 175 70 r14 promoção" tem cerca de **3,6 mil** (Planejador de Palavras-chave do Google). A medida certa está **na lateral do pneu que você já usa** e no manual do carro.

## Como ler a medida do pneu

Exemplo: **175/70 R14 84T**

- **175**: largura do pneu, em milímetros.
- **70**: altura da lateral, em % da largura.
- **R14**: pneu radial para roda (aro) de 14 polegadas.
- **84**: índice de carga (quanto peso cada pneu aguenta).
- **T**: índice de velocidade máxima.

Compre **a mesma medida e índices iguais ou maiores** que os indicados pelo fabricante do carro.

## Medidas mais procuradas em promoção

| Aro | Medidas comuns |
|---|---|
| 13 | 175/70 R13, 165/70 R13 |
| 14 | 175/70 R14, 175/65 R14, 185/70 R14, 185/65 R14 |
| 15 | 185/65 R15, 185/60 R15, 195/55 R15, 195/65 R15 |
| 16 | 205/55 R16 |

## O que conferir antes de comprar

1. **A data de fabricação** (DOT, os 4 últimos números: semana e ano). Pneu parado há muitos anos no estoque envelhece.
2. **O selo do Inmetro** e a etiqueta de eficiência (rolamento, frenagem na chuva e ruído).
3. **Se a montagem, o balanceamento e o alinhamento** estão incluídos ou são cobrados à parte. Algumas lojas têm oficinas parceiras.
4. **Kit de 2 ou 4 pneus** costuma sair mais barato por unidade.
5. **O preço de hoje**, comparado em comparadores com histórico.

## Receba as promoções no WhatsApp

As promoções de pneu saem nos grupos do Cuponito, com o link da loja oficial. Veja também todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Para sair, é só sair do grupo.
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Como saber a medida do pneu do meu carro?', 'answer', 'Está escrita na lateral do pneu que você usa, no formato 175/70 R14, e no manual do carro. Compre a mesma medida, com índices de carga e de velocidade iguais ou maiores.'),
    jsonb_build_object('question', 'O que significa 175/70 R14?', 'answer', '175 é a largura em milímetros, 70 é a altura da lateral em porcentagem da largura e R14 indica pneu radial para roda aro 14.'),
    jsonb_build_object('question', 'Pneu comprado na internet vem montado?', 'answer', 'Normalmente não: montagem, balanceamento e alinhamento costumam ser cobrados à parte. Algumas lojas têm oficinas parceiras; confira no anúncio.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. Os grupos do Cuponito são grátis e só os administradores postam.')
  ),
  NULL,
  NULL,
  NULL,
  NULL,
  'offers',
  'pneu,pneus',
  80,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  store_slug       = EXCLUDED.store_slug,
  title            = EXCLUDED.title,
  h1               = EXCLUDED.h1,
  meta_description = EXCLUDED.meta_description,
  intro            = EXCLUDED.intro,
  content          = EXCLUDED.content,
  faq              = EXCLUDED.faq,
  join_url         = EXCLUDED.join_url,
  group_name       = EXCLUDED.group_name,
  topics           = EXCLUDED.topics,
  offer_volume     = EXCLUDED.offer_volume,
  page_type        = EXCLUDED.page_type,
  offer_terms      = EXCLUDED.offer_terms,
  sort_order       = EXCLUDED.sort_order,
  is_published     = EXCLUDED.is_published,
  updated_at       = now();

-- /grupo-whatsapp/celular → /ofertas/celulares (o slug `celular` é da página do grupo, a que o ChatGPT cita; a de
-- ofertas pega a busca de produto, 90.500/mês)
UPDATE public.whatsapp_group_pages
SET content = content || $md$

Veja as [promoções de celular de hoje](/ofertas/celulares), com as ofertas que saíram no grupo.$md$,
    updated_at = now()
WHERE slug = 'celular'
  AND page_type IS DISTINCT FROM 'offers'
  AND content NOT LIKE '%/ofertas/celulares%';

-- /grupo-whatsapp/pc-gamer → notebook e PS5
UPDATE public.whatsapp_group_pages
SET content = content || $md$

Veja também o [notebook em promoção](/ofertas/notebook) e o [PS5 em promoção](/ofertas/ps5), com as ofertas que saíram no grupo.$md$,
    updated_at = now()
WHERE slug = 'pc-gamer'
  AND content NOT LIKE '%/ofertas/notebook%';

-- Geladeira e ar-condicionado → as novas páginas do mesmo grupo
UPDATE public.whatsapp_group_pages
SET content = replace(content, 'air fryer, micro-ondas, fogão, lava e seca e freezer',
      'air fryer, [micro-ondas](/ofertas/microondas), fogão, [máquina de lavar](/ofertas/maquina-de-lavar), [ventilador](/ofertas/ventilador) e freezer'),
    updated_at = now()
WHERE slug IN ('geladeira', 'ar-condicionado')
  AND content NOT LIKE '%/ofertas/microondas%';

-- Manicure → maquiagem; fraldas → brinquedos
UPDATE public.whatsapp_group_pages
SET content = content || $md$

Veja também a [maquiagem em promoção](/ofertas/maquiagem), com as ofertas do mesmo grupo.$md$,
    updated_at = now()
WHERE slug = 'manicure'
  AND content NOT LIKE '%/ofertas/maquiagem%';

UPDATE public.whatsapp_group_pages
SET content = content || $md$

Natal chegando: veja os [brinquedos em promoção](/ofertas/brinquedos), com as ofertas do mesmo grupo.$md$,
    updated_at = now()
WHERE slug = 'fraldas'
  AND content NOT LIKE '%/ofertas/brinquedos%';
