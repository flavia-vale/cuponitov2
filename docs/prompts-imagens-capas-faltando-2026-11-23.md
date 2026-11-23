# Prompts de imagens: as 5 capas que faltam (2026-11-23)

Estes 5 posts ainda usam `og-default.png` como imagem de compartilhamento e de busca. Os outros 8 já
têm capa própria em `public/imagens/blog/`. Mesmo método de `docs/prompts-imagens-blog-2026-10-09.md`:
gere na IA de imagem (Gemini, Midjourney, DALL·E, Ideogram), salve com o **nome de arquivo** abaixo e
mande aqui. Eu otimizo (WebP), ligo a `blog_posts.cover_image` com uma migration (como a
`20261009200000_capas_gemini_lote1.sql`) e uso o texto alternativo.

## Regras (iguais às de 09/10)

1. Sem rosto gerado por IA, sem logo de loja, sem print falso, sem preço inventado.
2. Sem texto escrito dentro da imagem (a IA erra as letras).
3. Para os 2 posts sobre o Espelha Grupos, um **print real** do painel vale mais que ilustração. Se
   puder, mande também `print-espelha-grupos-painel.png` (sem dados de cliente).

## Estilo base (colar antes de cada prompt)

> Ilustração editorial 3D suave, estilo flat moderno, fundo creme claro (#F5F3EF), cor de destaque
> laranja (#FF4D00) e verde WhatsApp (#25D366) só em detalhes, iluminação suave de estúdio, sombras
> leves, composição limpa com espaço livre à esquerda, sem texto, sem logotipos, sem marcas reais, sem
> pessoas com rosto detalhado, proporção 16:9, 1600x900.

## As 5 capas

| # | Post (slug) | Arquivo | Prompt (depois do estilo base) | Texto alternativo |
|---|---|---|---|---|
| 1 | `grupo-de-ofertas-whatsapp-e-confiavel` | `capa-grupo-ofertas-confiavel.png` | Celular genérico em pé com balões de mensagem verdes na tela, ao lado um escudo laranja com uma marca de verificação (sem texto) e uma lupa; ao fundo, pequenas sacolas de compras. Sinal de segurança, clima calmo. | Celular com mensagens de ofertas ao lado de um escudo de verificação e uma lupa |
| 2 | `como-escolher-grupo-de-ofertas-whatsapp` | `capa-escolher-grupo-ofertas.png` | Três celulares genéricos lado a lado, cada um com balões de mensagem de cor diferente na tela, uma mão estilizada (sem rosto) marcando o do meio com uma estrela laranja; lista de verificação ao fundo com marcas de check e sem texto. | Três celulares com grupos de mensagens e um deles marcado com uma estrela |
| 3 | `melhores-bots-grupos-de-cupons-whatsapp-2026` | `capa-bots-grupos-cupons.png` | Pequeno robô amigável segurando um celular que mostra balões de conversa verdes vazios, cupons de papel saindo da tela, várias bolhas de mensagem flutuando. | Robô segurando um celular com balões de mensagem e cupons |
| 4 | `como-espelhar-mensagens-grupo-de-cupons-whatsapp` | `capa-espelhar-grupo-cupons.png` | Dois celulares lado a lado, balões de mensagem verdes saindo de um e aparecendo espelhados no outro, setas curvas ligando os dois, cupons pequenos acompanhando as mensagens. | Dois celulares com mensagens sendo espelhadas de um para o outro |
| 5 | `decoracao-de-ano-novo-simples-e-barata` | `capa-decoracao-ano-novo.png` | Mesa posta com taças, uma garrafa sem rótulo, balões prateados e dourados, fitas, cartela de confete e um relógio de parede marcando quase meia-noite (sem números legíveis), tudo em tons de dourado e creme com um detalhe laranja. | Mesa de réveillon com taças, balões dourados e um relógio perto da meia-noite |

Observações:
- Os prompts 3 e 4 são os mesmos de 09/10 (esses dois posts ficaram sem capa no primeiro lote).
- Sugestão de ordem de uso: 1, 2, 3, 4 primeiro (o tema "grupo de ofertas" é o que o ChatGPT mais cita);
  o 5 é sazonal e perde valor depois de janeiro.
- Tamanho final: 1600x900. Eu converto para WebP (≈100 KB) antes de publicar.
