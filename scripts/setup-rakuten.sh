#!/usr/bin/env bash
# =============================================================================
# Setup Rakuten Advertising — executa todos os passos de uma vez
# Preencha as 5 variáveis abaixo antes de rodar:
#   chmod +x scripts/setup-rakuten.sh && ./scripts/setup-rakuten.sh
# =============================================================================
set -e

# ── Credenciais que você precisa preencher ────────────────────────────────────
SUPABASE_ACCESS_TOKEN=""   # app.supabase.com → Account → Access Tokens
SUPABASE_SERVICE_ROLE_KEY="" # Supabase Dashboard → Project Settings → API → service_role
RAKUTEN_TOKEN=""            # Rakuten: Web Service Token
RAKUTEN_ACCOUNT_NAME="Rakuten Brasil"
RAKUTEN_SID=""              # Rakuten: seu SID (Publisher Site ID)
RAKUTEN_SECURITY_TOKEN=""   # Rakuten: Security Token (guardado em extra_config)
# ─────────────────────────────────────────────────────────────────────────────

PROJECT_REF="jyvmrkykukialdbcebei"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"

# Validação
missing=()
[[ -z "$SUPABASE_ACCESS_TOKEN"   ]] && missing+=("SUPABASE_ACCESS_TOKEN")
[[ -z "$SUPABASE_SERVICE_ROLE_KEY" ]] && missing+=("SUPABASE_SERVICE_ROLE_KEY")
[[ -z "$RAKUTEN_TOKEN"           ]] && missing+=("RAKUTEN_TOKEN")
[[ -z "$RAKUTEN_SID"             ]] && missing+=("RAKUTEN_SID")
if [[ ${#missing[@]} -gt 0 ]]; then
  echo "❌  Preencha no script antes de rodar: ${missing[*]}"
  exit 1
fi

echo ""
echo "▶  1/5  Autenticando no Supabase CLI..."
npx supabase login --token "$SUPABASE_ACCESS_TOKEN"

echo ""
echo "▶  2/5  Linkando projeto $PROJECT_REF..."
cd "$(dirname "$0")/.."
npx supabase link --project-ref "$PROJECT_REF"

echo ""
echo "▶  3/5  Aplicando migration (registra provider Rakuten)..."
npx supabase db push --linked

echo ""
echo "▶  4/5  Setando secrets no Supabase..."
npx supabase secrets set \
  RAKUTEN_TOKEN="$RAKUTEN_TOKEN" \
  --project-ref "$PROJECT_REF"

echo ""
echo "▶  5/5  Fazendo deploy da edge function sync-rakuten..."
npx supabase functions deploy sync-rakuten --project-ref "$PROJECT_REF"

echo ""
echo "▶  6/6  Criando conta Rakuten em affiliate_accounts..."

# Buscar o ID do provider 'rakuten' recém-inserido
PROVIDER_ID=$(curl -s \
  "${SUPABASE_URL}/rest/v1/integration_providers?slug=eq.rakuten&select=id" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  | python3 -c "import sys,json; data=json.load(sys.stdin); print(data[0]['id'] if data else '')" 2>/dev/null)

if [[ -z "$PROVIDER_ID" ]]; then
  echo "⚠️   Provider 'rakuten' não encontrado após migration. Verifique o Supabase Dashboard."
  exit 1
fi

EXTRA_CONFIG=$(python3 -c "
import json
print(json.dumps({
  'sid': '${RAKUTEN_SID}',
  'security_token': '${RAKUTEN_SECURITY_TOKEN}',
  'env_secret': 'RAKUTEN_TOKEN',
  'network_id': '0'
}))
")

HTTP_STATUS=$(curl -s -o /tmp/rakuten_account_response.json -w "%{http_code}" \
  "${SUPABASE_URL}/rest/v1/affiliate_accounts" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -X POST \
  -d "$(python3 -c "
import json
print(json.dumps({
  'name': '${RAKUTEN_ACCOUNT_NAME}',
  'publisher_id': '${RAKUTEN_SID}',
  'api_token': None,
  'provider_id': '${PROVIDER_ID}',
  'extra_config': json.loads('${EXTRA_CONFIG}'.replace(\"'\", \"\\\"\") ),
  'active': True
}))
")")

if [[ "$HTTP_STATUS" == "201" ]]; then
  ACCOUNT_ID=$(python3 -c "import sys,json; d=json.load(open('/tmp/rakuten_account_response.json')); print(d[0]['id'] if isinstance(d,list) else d.get('id',''))" 2>/dev/null)
  echo "✅  Conta criada! ID: $ACCOUNT_ID"
else
  echo "⚠️   HTTP $HTTP_STATUS ao criar conta. Resposta:"
  cat /tmp/rakuten_account_response.json
fi

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  Setup Rakuten concluído!                        ║"
echo "║                                                      ║"
echo "║  Próximo passo: acesse /admin → Integrações          ║"
echo "║  e clique em Sincronizar na conta Rakuten Brasil.    ║"
echo "╚══════════════════════════════════════════════════════╝"
