import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCcw, Database, Code, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AwinTestPanel() {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const testIntegration = async () => {
    setLoading(true);
    setApiResponse(null);
    setErrorDetails(null);
    
    try {
      console.log('Disparando invoke para awin-integration...');
      
      // Chamada direta para a Edge Function
      const { data, error } = await supabase.functions.invoke('awin-integration');

      if (error) {
        console.error('Erro retornado pelo invoke:', error);
        throw error;
      }

      setApiResponse(data);
      toast.success('Dados da Awin recebidos!');
    } catch (error: any) {
      console.error('Erro na captura:', error);
      
      let msg = 'Erro desconhecido';
      if (error.message) msg = error.message;
      
      // Se for 404, pode ser que a função ainda não tenha sido "encontrada" pelo gateway
      if (msg.includes('404')) {
        msg = 'Função não encontrada (404). Isso pode acontecer nos primeiros minutos após a criação ou se o endpoint da Awin retornou 404.';
      }
      
      setErrorDetails(msg);
      toast.error('Falha na integração');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCcw className={loading ? "animate-spin" : ""} size={20} />
            Teste de Sincronização Awin
          </CardTitle>
          <CardDescription>
            ID do Publisher configurado: 2740940
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

          {errorDetails && (
            <div className="flex items-start gap-2 text-sm font-medium text-destructive bg-destructive/5 p-4 rounded-xl border border-destructive/20">
              <AlertCircle className="shrink-0 mt-0.5" size={16} />
              <div>
                <p>Erro Detectado:</p>
                <p className="text-xs opacity-80 mt-1 font-mono">{errorDetails}</p>
                <p className="text-[10px] mt-2 opacity-60 italic">Dica: Verifique se o nome da função no Supabase está exatamente como 'awin-integration'.</p>
              </div>
            </div>
          )}

          {apiResponse && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                <Database size={16} />
                Sucesso! {apiResponse.count || 0} promoções encontradas.
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground flex items-center gap-1">
                  <Code size={12} /> JSON de Resposta (Primeiro Registro):
                </label>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-xl overflow-auto max-h-[400px] text-[11px] font-mono leading-relaxed border border-white/10 shadow-inner">
                  {JSON.stringify(apiResponse.sample || apiResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}