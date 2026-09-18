#!/usr/bin/env node
// Aceitação da entrega de HTML para busca e IA (seção 1.3 do plano):
//
//   node scripts/diag-entrega-seo.mjs --host https://www.cuponito.com.br
//
// 1. nenhuma URL do sitemap responde diferente de 200
// 2. o HTML servido ao robô do ChatGPT já traz <h1>, <article> e ld+json
//    (sem executar JavaScript)
// 3. as URLs do site antigo redirecionam 301

const DEFAULT_HOST = 'https://www.cuponito.com.br';
const OAI_UA = 'Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)';
const CONCURRENCY = 6;

function parseArgs(argv) {
  const args = { host: DEFAULT_HOST };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--host' && argv[i + 1]) {
      args.host = argv[i + 1].replace(/\/$/, '');
      i += 1;
    }
  }
  return args;
}

async function mapLimit(items, limit, worker) {
  const results = [];
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index]);
    }
  });
  await Promise.all(runners);
  return results;
}

const { host } = parseArgs(process.argv.slice(2));
let failures = 0;

// ── 1. sitemap sem 404 ───────────────────────────────────────────────────────
console.log(`1. Varredura do sitemap de ${host}`);
const sitemapResponse = await fetch(`${host}/sitemap.xml`, { headers: { 'User-Agent': OAI_UA } });
if (!sitemapResponse.ok) {
  console.log(`   FALHA: /sitemap.xml respondeu ${sitemapResponse.status}`);
  failures += 1;
} else {
  const xml = await sitemapResponse.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].trim());
  console.log(`   ${urls.length} URLs no sitemap`);
  const statuses = await mapLimit(urls, CONCURRENCY, async url => {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': OAI_UA }, redirect: 'manual' });
      return { url, status: response.status };
    } catch (error) {
      return { url, status: 0, error: error.message };
    }
  });
  const bad = statuses.filter(entry => entry.status !== 200);
  for (const entry of bad) console.log(`   ${entry.status} ${entry.url}`);
  if (bad.length > 0) {
    console.log(`   FALHA: ${bad.length} URL(s) fora de 200`);
    failures += 1;
  } else {
    console.log('   OK: todas em 200');
  }
}

// ── 2. conteúdo no HTML sem JavaScript ───────────────────────────────────────
const CONTENT_PATHS = [
  '/blog/melhores-bots-grupos-de-cupons-whatsapp-2026',
  '/blog/como-espelhar-mensagens-grupo-de-cupons-whatsapp',
  '/quem-somos',
];

console.log('\n2. HTML do servidor para o OAI-SearchBot');
for (const path of CONTENT_PATHS) {
  try {
    const response = await fetch(`${host}${path}`, { headers: { 'User-Agent': OAI_UA } });
    const body = await response.text();
    const found = ['<h1', '<article', 'application/ld+json'].filter(needle =>
      body.toLowerCase().includes(needle)
    );
    const ok = response.status === 200 && found.length === 3;
    if (!ok) failures += 1;
    console.log(
      `   ${ok ? 'OK  ' : 'FALHA'} ${response.status} ${path} — ${found.length}/3 (${found.join(', ') || 'nada'}), ${body.length}B`
    );
  } catch (error) {
    failures += 1;
    console.log(`   FALHA ${path} — ${error.message}`);
  }
}

// ── 3. 301 das URLs do site antigo ───────────────────────────────────────────
const LEGACY_PATHS = ['/store/casas-bahia/', '/store/kabum/', '/stores-2/'];

console.log('\n3. Redirecionamento das URLs do site antigo');
for (const path of LEGACY_PATHS) {
  try {
    const response = await fetch(`${host}${path}`, {
      headers: { 'User-Agent': OAI_UA },
      redirect: 'manual',
    });
    const ok = response.status === 301;
    if (!ok) failures += 1;
    console.log(
      `   ${ok ? 'OK  ' : 'FALHA'} ${response.status} ${path} → ${response.headers.get('location') || '(sem Location)'}`
    );
  } catch (error) {
    failures += 1;
    console.log(`   FALHA ${path} — ${error.message}`);
  }
}

console.log('');
if (failures > 0) {
  console.log(`FALHA: ${failures} verificação(ões) reprovada(s).`);
  process.exit(1);
}
console.log('OK: sitemap sem 404, HTML com conteúdo e 301 do site antigo.');
