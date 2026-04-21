import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCcw, Database, Code } from 'lucide-react';
import { toast } from 'sonner';

export function AwinTestPanel() {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const testIntegration = async () => {
    setLoading(true);
    try {
      // Invocando a Edge Function usando a URL direta conforme as regras
      const { data, error } = await supabase.functions.invoke('awin-integration');

      if (error) throw error;

      setApiResponse(data);
      toast.success('Dados da Awin recebidos com sucesso!');
    } catch (error: any) {
      console.error('Erro ao testar Awin:', error);
      toast.error('Erro na integração: ' + (error.message || 'Verifique os logs no Supabase'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCcw className={loading ? "animate-spin" : ""} />
            Teste de Sincronização Awin
          </CardTitle>
          <CardDescription>
            Clique no botão abaixo para disparar a Edge Function e mapear os campos da API para o Publisher ID 2740940.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testIntegration} 
            disabled={loading}
            className="w-full md:w-auto gap-2"
          >
            {loading ? 'Consultando API...' : 'Disparar Chamada de Teste'}
          </Button>

          {apiResponse && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                <Database size={16} />
                Sucesso! {apiResponse.count} promoções encontradas.
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground flex items-center gap-1">
                  <Code size={12} /> Exemplo do primeiro registro para mapeamento:
                </label>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-xl overflow-auto max-h-[400px] text-[11px] font-mono leading-relaxed border border-white/10 shadow-inner">
                  {JSON.stringify(apiResponse.sample || 'Nenhum dado retornado no array sample', null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
