export const howItWorksSteps = [
  'Busque a loja onde você quer comprar',
  'Escolha o cupom ou a oferta que mais te interessa',
  'Clique em "copiar código" e cole no carrinho da loja na hora de fechar o pedido.',
  'Pronto, o desconto já aparece!',
];

export const faqs = [
  {
    question: 'Por que meu cupom não funcionou?',
    answer:
      'A maioria dos cupons têm regras: valor mínimo de compra, produto específico, prazo de validade ou limite de uso por CPF. A gente sempre tenta deixar isso claro na descrição.',
  },
  {
    question: 'Preciso me cadastrar para usar os cupons?',
    answer: 'Não. Nenhum cadastro, nenhuma assinatura, nenhum custo. É só clicar e copiar.',
  },
  {
    question: 'O cuponito cobra alguma coisa?',
    answer:
      'Nunca. O site é 100% gratuito pra você. A gente recebe uma comissão das lojas quando uma compra é finalizada, sem nenhum custo adicional para quem compra.',
  },
  {
    question: 'Com que frequência os cupons são atualizados?',
    answer:
      'Todo dia. A equipe verifica os cupons ativos e remove os que venceram. Se você encontrar um que não funciona, fique a vontade para avisar a gente.',
  },
  {
    question: 'Posso sugerir uma loja ou um cupom?',
    answer: 'Pode sim! Usa o formulário da página de contato e a gente analisa.',
  },
];

// Fonte única dos textos institucionais: o React e o prerender do Edge
// (`prerender/render.ts`) leem daqui, então o HTML do servidor não diverge da página.

export const institutionalMeta = {
  howItWorks: {
    path: '/como-funciona',
    title: 'Como funciona',
    description:
      'Veja como usar o Cuponito para buscar lojas, copiar cupons verificados e economizar no carrinho.',
  },
  faq: {
    path: '/perguntas-frequentes',
    title: 'Perguntas frequentes',
    description:
      'Tire dúvidas sobre cupons, cadastro, custo, atualização dos descontos e sugestões de lojas no Cuponito.',
  },
  contact: {
    path: '/fale-conosco',
    title: 'Fale conosco',
    description:
      'Entre em contato com o time do Cuponito para avisar sobre cupons, sugerir lojas ou tirar dúvidas.',
  },
  terms: {
    path: '/termos-de-uso',
    title: 'Termos de uso',
    description:
      'Confira as condições de uso do Cuponito, incluindo validade de cupons, responsabilidade das lojas e links de afiliados.',
  },
} as const;

export const howItWorksIntro = 'Economizar com o cuponito é simples assim:';
export const howItWorksClosing = [
  'O que faz o cuponito diferente é que a gente só publica cupom que funciona. Cada código é verificado antes de ir pro ar e a lista é atualizada todos os dias.',
  'Sem cadastro. Sem taxa. Sem pegadinha. Só desconto de verdade.',
];

export const contactParagraphs = [
  'Encontrou um cupom que não funcionou? Quer sugerir uma loja? Tem alguma dúvida que não está no FAQ?',
  'Manda mensagem aqui embaixo. O time do Cuponito lê tudo e te responde o mais rápido possível.',
  'Adoramos ouvir, de verdade.',
];
export const contactMailto = 'mailto:contato@cuponito.com.br?subject=Contato%20pelo%20Cuponito';

export const termsIntro =
  'Estes termos explicam como usar o Cuponito de forma simples e transparente. Ao navegar pelo site, você concorda com as condições abaixo.';

export const termsSections = [
  {
    title: 'Uso gratuito dos cupons',
    content:
      'O Cuponito organiza cupons, ofertas e links promocionais para ajudar você a economizar. O uso do site é gratuito e não exige cadastro para copiar códigos de desconto.',
  },
  {
    title: 'Validade das ofertas',
    content:
      'Apesar da verificação frequente, os cupons podem mudar, expirar ou depender de regras definidas por cada loja, como valor mínimo, categoria participante, estoque ou limite por CPF.',
  },
  {
    title: 'Responsabilidade das lojas',
    content:
      'A compra, o pagamento, a entrega, a troca e o atendimento pós-venda acontecem diretamente no site da loja parceira. Antes de finalizar o pedido, confira as condições exibidas pela loja.',
  },
  {
    title: 'Links de afiliados',
    content:
      'Alguns links podem gerar comissão para o Cuponito quando uma compra é concluída, sem custo adicional para você. Essa comissão ajuda a manter a curadoria e atualização dos descontos.',
  },
  {
    title: 'Contato',
    content:
      'Se encontrar um cupom com problema, uma informação desatualizada ou quiser sugerir uma loja, fale com a gente pela página de contato.',
  },
];
