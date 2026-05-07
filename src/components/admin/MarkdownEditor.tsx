import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote,
  Link as LinkIcon, ImageIcon, Eye, Edit3, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  content: string;
  onChange: (md: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

function insertAround(ta: HTMLTextAreaElement, before: string, after: string, placeholder: string) {
  const { selectionStart: s, selectionEnd: e, value } = ta;
  const selected = value.slice(s, e) || placeholder;
  const next = value.slice(0, s) + before + selected + after + value.slice(e);
  return { next, cursor: s + before.length + selected.length + after.length };
}

function insertLine(ta: HTMLTextAreaElement, prefix: string, placeholder: string) {
  const { selectionStart: s, value } = ta;
  const lineStart = value.lastIndexOf('\n', s - 1) + 1;
  const lineEnd = value.indexOf('\n', s);
  const end = lineEnd === -1 ? value.length : lineEnd;
  const line = value.slice(lineStart, end) || placeholder;
  const next = value.slice(0, lineStart) + prefix + line + value.slice(end);
  return { next, cursor: lineStart + prefix.length + line.length };
}

export function MarkdownEditor({ content, onChange, onImageUpload }: Props) {
  const [preview, setPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const apply = (next: string, cursor: number) => {
    onChange(next);
    requestAnimationFrame(() => {
      if (taRef.current) {
        taRef.current.focus();
        taRef.current.setSelectionRange(cursor, cursor);
      }
    });
  };

  const wrap = (before: string, after: string, placeholder: string) => {
    if (!taRef.current) return;
    const { next, cursor } = insertAround(taRef.current, before, after, placeholder);
    apply(next, cursor);
  };

  const line = (prefix: string, placeholder: string) => {
    if (!taRef.current) return;
    const { next, cursor } = insertLine(taRef.current, prefix, placeholder);
    apply(next, cursor);
  };

  const addLink = () => {
    const url = prompt('URL do link:');
    if (!url || !taRef.current) return;
    const { selectionStart: s, selectionEnd: e, value } = taRef.current;
    const selected = value.slice(s, e) || 'texto do link';
    const insert = `[${selected}](${url})`;
    const next = value.slice(0, s) + insert + value.slice(e);
    apply(next, s + insert.length);
  };

  const handleImageFile = async (file: File) => {
    setUploadingImage(true);
    try {
      const url = await onImageUpload(file);
      const link = prompt('Link de destino da imagem (deixe em branco para sem link):');
      if (!taRef.current) return;
      const { selectionStart: s, value } = taRef.current;
      const md = link ? `[![imagem](${url})](${link})` : `![imagem](${url})`;
      const next = value.slice(0, s) + '\n' + md + '\n' + value.slice(s);
      apply(next, s + md.length + 2);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const ToolBtn = ({
    onClick, title, active, disabled, children,
  }: { onClick: () => void; title: string; active?: boolean; disabled?: boolean; children: React.ReactNode }) => (
    <Button
      type="button"
      variant={active ? 'default' : 'ghost'}
      size="icon"
      className="h-8 w-8"
      title={title}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5 bg-muted/30">
        <ToolBtn onClick={() => wrap('**', '**', 'negrito')} title="Negrito (**texto**)">
          <Bold className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => wrap('*', '*', 'itálico')} title="Itálico (*texto*)">
          <Italic className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => line('## ', 'Título H2')} title="Título H2">
          <Heading2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => line('### ', 'Título H3')} title="Título H3">
          <Heading3 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => line('- ', 'item')} title="Lista com marcadores">
          <List className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => line('1. ', 'item')} title="Lista numerada">
          <ListOrdered className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => line('> ', 'citação')} title="Citação (> texto)">
          <Quote className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={addLink} title="Link ([texto](url))">
          <LinkIcon className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          onClick={() => fileInputRef.current?.click()}
          title="Inserir imagem (você pode adicionar link de destino)"
          disabled={uploadingImage}
        >
          {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </ToolBtn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
        />

        <div className="ml-auto flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground mr-1 hidden sm:inline">
            {preview ? 'pré-visualização' : 'markdown'}
          </span>
          <ToolBtn onClick={() => setPreview(false)} title="Editar" active={!preview}>
            <Edit3 className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn onClick={() => setPreview(true)} title="Pré-visualizar" active={preview}>
            <Eye className="h-4 w-4" />
          </ToolBtn>
        </div>
      </div>

      {/* hint */}
      {!preview && (
        <div className="px-4 py-1.5 bg-primary/5 border-b border-border text-[10px] text-muted-foreground">
          Dica: para imagem clicável escreva{' '}
          <code className="font-mono bg-black/5 px-1 rounded">[![alt](url_imagem)](url_destino)</code>
        </div>
      )}

      {preview ? (
        <div
          className="prose prose-neutral max-w-none min-h-[300px] p-4 text-foreground text-sm
            prose-headings:text-[#1a1a1a] prose-headings:font-black
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-black/5 prose-h2:pb-3
            prose-strong:text-[#1a1a1a] prose-strong:font-black
            prose-a:text-primary prose-a:font-black prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-xl prose-img:my-4"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '*Nada para pré-visualizar ainda…*'}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          ref={taRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Comece a escrever seu artigo em Markdown…&#10;&#10;## Título&#10;&#10;Parágrafo normal com **negrito** e *itálico*.&#10;&#10;![imagem](url) — imagem simples&#10;[![imagem](url_imagem)](url_destino) — imagem com link"
          className="w-full min-h-[380px] resize-y p-4 font-mono text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none"
          spellCheck
        />
      )}
    </div>
  );
}
