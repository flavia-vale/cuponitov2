import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

// Rotas críticas para o SEO que precisam de pastas físicas
const routes = [
  'blog',
  'desconto/cupom-desconto-amazon',
  'desconto/cupom-desconto-shopee',
  'desconto/cupom-desconto-mercado-livre',
  'desconto/cupom-desconto-magalu',
  'desconto/cupom-desconto-aliexpress'
];

if (!fs.existsSync(INDEX_HTML)) {
  console.error('Erro: dist/index.html não encontrado. Execute o build do Vite primeiro.');
  process.exit(1);
}

console.log('--- Iniciando geração de pastas físicas para SEO ---');

routes.forEach(route => {
  const targetDir = path.join(DIST_DIR, route);
  
  // Cria a pasta física
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copia o index.html para dentro da pasta (o servidor entregará este arquivo no acesso direto)
  fs.copyFileSync(INDEX_HTML, path.join(targetDir, 'index.html'));
  console.log(`✅ Rota física criada: /${route}`);
});

// Garante que o 404.html também seja uma cópia do index.html (fallback secundário)
fs.copyFileSync(INDEX_HTML, path.join(DIST_DIR, '404.html'));
console.log('✅ 404.html atualizado.');
console.log('--- Processo concluído com sucesso ---');