import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCcw, Database, Play } from 'lucide-react';
import { toast } from 'sonner';

const INTEGRATIONS = [
  { id: 'sync-casas-bahia', name: 'Casas Bahia', publisher: '2740940' },
  { id: 'sync-awin-others', name: 'Awin - Outras lojas', publisher: '2701264' }
];

export function AwinTestPanel() {
  const [loading, setLoading] = useState<string | null>(null);

  const runSync = async (functionName: string) => {
    setLoading(functionName);
    try {
      const { data, error } = await supabase.functions.invoke(functionName);
      if (error) throw error;
      
      toast.success(`${data.store}: ${data.count} ofertas sincronizadas!`);
    } catch (error: any) {
      console.error('Erro na sincronização:', error);
      toast.error(`Falha ao sincronizar: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database size={20} className="text-primary" />
          Sincronização de APIs
        </CardTitle>
        <CardDescription>
          Gerencie cada integração de forma independente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {INTEGRATIONS.map((integration) => (
            <div key={integration.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{integration.name}</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black">ID: {integration.publisher}</span>
              </div>
              <Button 
                onClick={() => runSync(integration.id)} 
                disabled={loading !== null}
                variant="secondary"
                size="sm"
                className="w-full gap-2"
              >
                {loading === integration.id ? (
                  <RefreshCcw className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                Sincronizar Agora
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}