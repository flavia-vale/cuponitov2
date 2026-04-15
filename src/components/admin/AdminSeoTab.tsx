import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Settings, Link as LinkIcon, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSettings, useUpdateSettings, type SiteSettings } from '@/hooks/useSettings';

export function AdminSeoTab() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [localSettings, setLocalSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleSave = async (key: keyof SiteSettings) => {
    if (!localSettings) return;
    try {
      await updateSettings.mutateAsync({ key, value: localSettings[key] });
      toast({ title: 'Configurações salvas!', description: `A seção ${key} foi atualizada.` });
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    }
  };

  if (isLoading || !localSettings) return <div className="p-8 text-center text-muted-foreground">Carregando configurações...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SEO & Configurações Gerais</h1>
        <p className="text-sm text-muted-foreground">Controle total sobre textos, links e metadados sem código</p>
      </div>

      <div className="grid gap-6">
        {/* SEO HOME */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Home className="h-4 w-4" /> SEO da Home</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Título (use {'{month_year}'} para data automática)</label>
              <Input 
                value={localSettings.seo_defaults.home_title} 
                onChange={(e) => setLocalSettings({ ...localSettings, seo_defaults: { ...localSettings.seo_defaults, home_title: e.target.value }})} 
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Description</label>
              <Textarea 
                value={localSettings.seo_defaults.home_description} 
                onChange={(e) => setLocalSettings({ ...localSettings, seo_defaults: { ...localSettings.seo_defaults, home_description: e.target.value }})}
                rows={3} 
              />
            </div>
            <Button onClick={() => handleSave('seo_defaults')} disabled={updateSettings.isPending} className="gap-1.5">
              <Save className="h-4 w-4" /> Salvar SEO
            </Button>
          </CardContent>
        </Card>

        {/* HERO SECTION */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Settings className="h-4 w-4" /> Conteúdo do Hero (Página Inicial)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Título Principal</label>
                <Input 
                  value={localSettings.hero_content.title} 
                  onChange={(e) => setLocalSettings({ ...localSettings, hero_content: { ...localSettings.hero_content, title: e.target.value }})} 
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Subtítulo</label>
                <Input 
                  value={localSettings.hero_content.subtitle} 
                  onChange={(e) => setLocalSettings({ ...localSettings, hero_content: { ...localSettings.hero_content, subtitle: e.target.value }})} 
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Descrição</label>
              <Textarea 
                value={localSettings.hero_content.description} 
                onChange={(e) => setLocalSettings({ ...localSettings, hero_content: { ...localSettings.hero_content, description: e.target.value }})}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Texto do Botão WhatsApp</label>
              <Input 
                value={localSettings.hero_content.button_text} 
                onChange={(e) => setLocalSettings({ ...localSettings, hero_content: { ...localSettings.hero_content, button_text: e.target.value }})} 
              />
            </div>
            <Button onClick={() => handleSave('hero_content')} disabled={updateSettings.isPending} className="gap-1.5">
              <Save className="h-4 w-4" /> Salvar Hero
            </Button>
          </CardContent>
        </Card>

        {/* LINKS GLOBAIS */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><LinkIcon className="h-4 w-4" /> Links e Contatos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Link do Grupo WhatsApp</label>
              <Input 
                value={localSettings.global_links.whatsapp_group} 
                onChange={(e) => setLocalSettings({ ...localSettings, global_links: { ...localSettings.global_links, whatsapp_group: e.target.value }})} 
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">E-mail de Contato</label>
              <Input 
                value={localSettings.global_links.contact_email} 
                onChange={(e) => setLocalSettings({ ...localSettings, global_links: { ...localSettings.global_links, contact_email: e.target.value }})} 
              />
            </div>
            <Button onClick={() => handleSave('global_links')} disabled={updateSettings.isPending} className="gap-1.5">
              <Save className="h-4 w-4" /> Salvar Links
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}