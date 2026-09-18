#!/usr/bin/env node
// Verifica se os robôs de busca e de clique das IAs conseguem acessar o site
// (firewall da Vercel, Bot Protection, regra de taxa).
//
//   node scripts/diag-acesso-robos-ia.mjs --url https://www.cuponito.com.br/
//
// Saída: uma linha por robô. Marca `busca_bloqueada` quando um robô de BUSCA
// (o que alimenta o índice consultado na hora de responder) leva 403.
// Um 403 para o "Googlebot falso" abaixo é esperado e correto: a Vercel
// verifica o robô pelo IP, e este script não roda de um IP do Google.

const DEFAULT_URL = 'https://www.cuponito.com.br/';

const AGENTS = [
  { id: 'navegador', kind: 'humano', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36' },
  { id: 'bingbot', kind: 'busca', ua: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)' },
  { id: 'oai-searchbot', kind: 'busca', ua: 'Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)' },
  { id: 'chatgpt-user', kind: 'clique', ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot' },
  { id: 'gptbot', kind: 'treino', ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)' },
  { id: 'claudebot', kind: 'treino', ua: 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)' },
  { id: 'claude-searchbot', kind: 'busca', ua: 'Mozilla/5.0 (compatible; Claude-SearchBot/1.0; +https://www.anthropic.com/claude-searchbot)' },
  { id: 'claude-user', kind: 'clique', ua: 'Mozilla/5.0 (compatible; Claude-User/1.0; +Claude-User@anthropic.com)' },
  { id: 'perplexitybot', kind: 'busca', ua: 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)' },
  { id: 'perplexity-user', kind: 'clique', ua: 'Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)' },
  { id: 'applebot', kind: 'busca', ua: 'Mozilla/5.0 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)' },
  { id: 'duckassistbot', kind: 'busca', ua: 'Mozilla/5.0 (compatible; DuckAssistBot/1.0; +https://duckduckgo.com/duckassistbot)' },
  { id: 'googlebot-falso', kind: 'esperado-403', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
];

function parseArgs(argv) {
  const args = { url: DEFAULT_URL };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--url' && argv[i + 1]) {
      args.url = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

async function probe(url, agent) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': agent.ua, Accept: 'text/html' },
      redirect: 'manual',
    });
    const body = response.status < 400 ? await response.text() : '';
    return {
      status: response.status,
      ms: Date.now() - started,
      bytes: body.length,
      mitigated: response.headers.get('x-vercel-mitigated') || '',
      prerendered: response.headers.get('x-prerendered') === 'true',
      hasH1: /<h1[\s>]/i.test(body),
      hasArticle: /<article[\s>]/i.test(body),
      hasJsonLd: /application\/ld\+json/i.test(body),
    };
  } catch (error) {
    return { status: 0, ms: Date.now() - started, error: error.message };
  }
}

const { url } = parseArgs(process.argv.slice(2));
console.log(`Alvo: ${url}\n`);

let blocked = 0;

for (const agent of AGENTS) {
  // sequencial de propósito: rajada paralela dispara a regra de taxa e
  // devolveria um 403 que não é o que queremos medir
  const result = await probe(url, agent);
  const flags = [];
  if (result.error) flags.push(`erro=${result.error}`);
  if (result.mitigated) flags.push(`x-vercel-mitigated=${result.mitigated}`);
  if (result.prerendered) flags.push('prerender');
  if (result.hasH1) flags.push('h1');
  if (result.hasArticle) flags.push('article');
  if (result.hasJsonLd) flags.push('ld+json');

  const isBlocked = result.status === 403 || result.status === 0;
  if (isBlocked && agent.kind !== 'esperado-403') {
    blocked += 1;
    flags.push(agent.kind === 'busca' ? 'busca_bloqueada' : 'bloqueado');
  }

  console.log(
    `${String(result.status).padStart(3)} ${agent.id.padEnd(18)} ${agent.kind.padEnd(13)} ` +
    `${String(result.bytes ?? 0).padStart(7)}B ${String(result.ms).padStart(5)}ms ${flags.join(' ')}`
  );
}

console.log('');
if (blocked > 0) {
  console.log(`FALHA: ${blocked} robô(s) bloqueado(s). Confira Vercel → Firewall → Bot Protection.`);
  process.exit(1);
}
console.log('OK: nenhum robô de busca ou de clique bloqueado.');
