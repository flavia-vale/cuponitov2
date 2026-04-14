import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function AdminSeoTab() {
  const [title, setTitle] = useState('Cupom de Desconto 2025 → Ofertas Atualizadas Hoje');
  const [description, setDescription] = useState('Os melhores cupons de desconto para Amazon, Shopee e Mercado Livre. Economize agora com ofertas verificadas e atualizadas diariamente.');

  const handleSave = () => { toast({ title: 'Configurações de SEO salvas!', description: 'As alterações serão refletidas no próximo deploy.' }); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">SEO & Configurações</h1><p className="text-sm text-muted-foreground">Configure os metadados globais do site</p></div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Settings className="h-4 w-4" /> Metadados da Home</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Título da Página (max 60 caracteres)</label><Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} /><p className="mt-1 text-xs text-muted-foreground">{title.length}/60 caracteres</p></div>
          <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Description (max 160 caracteres)</label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={160} rows={3} /><p className="mt-1 text-xs text-muted-foreground">{description.length}/160 caracteres</p></div>
          <div className="rounded-lg border border-border bg-muted/30 p-3"><p className="mb-1 text-xs font-medium text-muted-foreground">Pré-visualização no Google:</p><p className="text-sm font-medium text-blue-600">{title || 'Título da página'}</p><p className="text-xs text-green-700">cuponito.com.br</p><p className="text-xs text-muted-foreground">{description || 'Descrição da página...'}</p></div>
          <Button onClick={handleSave} className="gap-1.5"><Save className="h-4 w-4" /> Salvar configurações</Button>
        </CardContent>
      </Card>
    </div>
  );
}
