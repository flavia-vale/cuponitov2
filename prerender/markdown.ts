// Conversor Markdown → HTML mínimo, para o prerender no Edge.
// Cobre o que o blog do Cuponito usa de fato (o mesmo subconjunto que o
// react-markdown + remark-gfm renderiza no cliente): títulos, listas,
// tabelas GFM, citações, links, negrito/itálico, código inline e parágrafos.
// Não é um parser completo de propósito: rodar marked/remark no middleware
// pesaria no cold start do Edge sem ganho para o robô.

export function escapeHtml(value: string): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inline(text: string): string {
  let out = escapeHtml(text);

  // imagem antes do link — a sintaxe do link é prefixo da imagem
  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (_m, alt: string, src: string) => `<img src="${src}" alt="${alt}" loading="lazy" />`
  );
  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, label: string, href: string) => `<a href="${href}">${label}</a>`
  );
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  out = out.replace(/(^|[\s(])_([^_\n]+)_/g, '$1<em>$2</em>');

  return out;
}

function splitTableRow(line: string): string[] {
  return line
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map(cell => cell.trim());
}

function isTableDivider(line: string): boolean {
  return /^\s*\|?[\s:-]*-[\s|:-]*$/.test(line) && line.includes('-');
}

export interface MarkdownOptions {
  /**
   * Quanto rebaixar os títulos do conteúdo. Os posts do CMS usam `#` para as
   * seções, então numa página que já imprime o título do post em `<h1>` o
   * conteúdo precisa começar em `<h2>` — vários `<h1>` na mesma página
   * atrapalham a leitura da hierarquia pelo crawler.
   */
  demoteHeadings?: number;
}

export function markdownToHtml(markdown: string, options: MarkdownOptions = {}): string {
  const demote = options.demoteHeadings ?? 0;
  const lines = (markdown ?? '').replace(/\r\n/g, '\n').split('\n');
  const parts: string[] = [];
  let index = 0;

  const flushParagraph = (buffer: string[]) => {
    if (buffer.length === 0) return;
    parts.push(`<p>${inline(buffer.join(' '))}</p>`);
    buffer.length = 0;
  };

  const paragraph: string[] = [];

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      flushParagraph(paragraph);
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushParagraph(paragraph);
      const level = Math.min(6, heading[1].length + demote);
      parts.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(line)) {
      flushParagraph(paragraph);
      parts.push('<hr />');
      index += 1;
      continue;
    }

    // tabela GFM: linha de cabeçalho seguida da linha divisória
    if (line.includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      flushParagraph(paragraph);
      const header = splitTableRow(line);
      index += 2;
      const bodyRows: string[][] = [];
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        bodyRows.push(splitTableRow(lines[index]));
        index += 1;
      }
      const head = header.map(cell => `<th>${inline(cell)}</th>`).join('');
      const body = bodyRows
        .map(row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join('')}</tr>`)
        .join('');
      parts.push(`<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`);
      continue;
    }

    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    if (bullet) {
      flushParagraph(paragraph);
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*[-*+]\s+(.*)$/);
        if (!item) break;
        items.push(`<li>${inline(item[1].trim())}</li>`);
        index += 1;
      }
      parts.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ordered) {
      flushParagraph(paragraph);
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*\d+[.)]\s+(.*)$/);
        if (!item) break;
        items.push(`<li>${inline(item[1].trim())}</li>`);
        index += 1;
      }
      parts.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    const quote = line.match(/^\s*>\s?(.*)$/);
    if (quote) {
      flushParagraph(paragraph);
      const quoted: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*>\s?(.*)$/);
        if (!item) break;
        quoted.push(item[1].trim());
        index += 1;
      }
      parts.push(`<blockquote><p>${inline(quoted.join(' '))}</p></blockquote>`);
      continue;
    }

    paragraph.push(line.trim());
    index += 1;
  }

  flushParagraph(paragraph);
  return parts.join('\n');
}

export function markdownToPlainText(markdown: string, maxLength = 220): string {
  const text = (markdown ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
