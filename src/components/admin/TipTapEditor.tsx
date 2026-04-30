import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExt from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Link as LinkIcon, ImageIcon, Undo, Redo, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface Props { content: string; onChange: (html: string) => void; }

export function TipTapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } }), LinkExt.configure({ openOnClick: false }), Image, Placeholder.configure({ placeholder: 'Comece a escrever seu artigo…' })],
    content,
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
    editorProps: { attributes: { class: 'prose prose-neutral max-w-none min-h-[300px] p-4 focus:outline-none text-foreground prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-1' } },
  });

  useEffect(() => { if (editor && content !== editor.getHTML()) editor.commands.setContent(content || ''); }, [content, editor]);

  if (!editor) return null;

  const addLink = () => { const url = prompt('URL do link:'); if (url) editor.chain().focus().setLink({ href: url }).run(); };
  const addImage = () => { const url = prompt('URL da imagem:'); if (url) editor.chain().focus().setImage({ src: url }).run(); };

  const ToolBtn = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
    <Button type="button" variant={active ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={onClick} title={title}>{children}</Button>
  );

  return (
    <div className="rounded-xl border border-border bg-background">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito"><Bold className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico"><Italic className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2"><Heading2 className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3"><Heading3 className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista"><List className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada"><ListOrdered className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citação"><Quote className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={addLink} active={editor.isActive('link')} title="Link"><LinkIcon className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={addImage} title="Imagem"><ImageIcon className="h-4 w-4" /></ToolBtn>
        <div className="ml-auto flex gap-0.5">
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Desfazer"><Undo className="h-4 w-4" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Refazer"><Redo className="h-4 w-4" /></ToolBtn>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
