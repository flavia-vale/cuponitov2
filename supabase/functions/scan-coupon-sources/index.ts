import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CouponSource = {
  id: string;
  marketplace_slug: string;
  name: string;
  source_type: string;
  source_url: string;
  keywords: string[];
  scan_interval_minutes: number;
};

type CouponCandidate = {
  rawCode: string;
  normalizedCode: string;
  title: string;
  description: string;
  confidenceScore: number;
};

type ScanResult = {
  source_id: string;
  source_url: string;
  candidates_found: number;
  evidence_inserted: number;
  skipped_duplicates: number;
};

const couponCodePattern = /(?:cupom|coupon|voucher|c[oó]digo|code)\D{0,24}([A-Z0-9][A-Z0-9_-]{3,24})/giu;
const htmlTagPattern = /<[^>]+>/g;
const whitespacePattern = /\s+/g;
const maxResponseBytes = 750_000;

function normalizeCode(code: string): string {
  return code
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9_-]/gi, "")
    .toUpperCase();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(htmlTagPattern, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(whitespacePattern, " ")
    .trim();
}

function buildSnippet(text: string, index: number): string {
  const start = Math.max(0, index - 120);
  const end = Math.min(text.length, index + 180);
  return text.slice(start, end).trim();
}

function hasKeywordContext(snippet: string, keywords: string[]): boolean {
  const normalizedSnippet = snippet.toLocaleLowerCase("pt-BR");
  return keywords.some((keyword) => normalizedSnippet.includes(keyword.toLocaleLowerCase("pt-BR")));
}

function extractCandidates(html: string, keywords: string[]): CouponCandidate[] {
  const text = stripHtml(html);
  const candidates = new Map<string, CouponCandidate>();

  for (const match of text.matchAll(couponCodePattern)) {
    const rawCode = match[1] ?? "";
    const normalizedCode = normalizeCode(rawCode);

    if (normalizedCode.length < 4) continue;

    const snippet = buildSnippet(text, match.index ?? 0);
    if (!hasKeywordContext(snippet, keywords)) continue;

    candidates.set(normalizedCode, {
      rawCode,
      normalizedCode,
      title: `Cupom encontrado em fonte pública: ${normalizedCode}`,
      description: snippet,
      confidenceScore: 45,
    });
  }

  return Array.from(candidates.values());
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function fetchPublicHtml(sourceUrl: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(sourceUrl, {
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent": "CuponitoV2CouponScout/0.1 (+https://www.cuponito.com.br)",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Fonte retornou HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new Error(`Content-Type não suportado: ${contentType || "não informado"}`);
    }

    const text = await response.text();
    return text.slice(0, maxResponseBytes);
  } finally {
    clearTimeout(timeout);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const now = new Date();
  const nowIso = now.toISOString();

  try {
    const body = await req.json().catch((): { source_id?: string } => ({}));
    const requestedSourceId = typeof body.source_id === "string" ? body.source_id : null;

    let query = supabase
      .from("coupon_sources")
      .select("id, marketplace_slug, name, source_type, source_url, keywords, scan_interval_minutes")
      .eq("enabled", true)
      .lte("next_scan_at", nowIso)
      .order("next_scan_at", { ascending: true })
      .limit(5);

    if (requestedSourceId) {
      query = supabase
        .from("coupon_sources")
        .select("id, marketplace_slug, name, source_type, source_url, keywords, scan_interval_minutes")
        .eq("enabled", true)
        .eq("id", requestedSourceId)
        .limit(1);
    }

    const { data: sources, error: sourceError } = await query;
    if (sourceError) throw sourceError;

    const enabledSources = (sources ?? []) as CouponSource[];
    if (enabledSources.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "Nenhuma fonte habilitada para varredura", checked_at: nowIso }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: ScanResult[] = [];

    for (const source of enabledSources) {
      const nextScanAt = new Date(Date.now() + source.scan_interval_minutes * 60_000).toISOString();

      try {
        if (source.source_type !== "public_page") {
          throw new Error(`Tipo de fonte ainda não suportado pelo scanner: ${source.source_type}`);
        }

        const html = await fetchPublicHtml(source.source_url);
        const candidates = extractCandidates(html, source.keywords ?? []);

        let evidenceInserted = 0;
        let skippedDuplicates = 0;

        for (const candidate of candidates) {
          const contentHash = await sha256(`${source.id}:${candidate.normalizedCode}:${candidate.description}`);

          const { error: evidenceError } = await supabase
            .from("coupon_evidence")
            .insert({
              source_id: source.id,
              marketplace_slug: source.marketplace_slug,
              raw_code: candidate.rawCode,
              normalized_code: candidate.normalizedCode,
              title: candidate.title,
              description: candidate.description,
              source_url: source.source_url,
              source_type: source.source_type,
              evidence_type: "html_text",
              confidence_score: candidate.confidenceScore,
              content_hash: contentHash,
              extracted_payload: {
                scanner: "scan-coupon-sources",
                source_name: source.name,
              },
              status: "pending_review",
            });

          if (evidenceError) {
            if (evidenceError.code === "23505") {
              skippedDuplicates += 1;
              continue;
            }
            throw evidenceError;
          }

          evidenceInserted += 1;
        }

        await supabase
          .from("coupon_sources")
          .update({
            last_scan_at: nowIso,
            next_scan_at: nextScanAt,
            last_status: "success",
            last_error: null,
          })
          .eq("id", source.id);

        results.push({
          source_id: source.id,
          source_url: source.source_url,
          candidates_found: candidates.length,
          evidence_inserted: evidenceInserted,
          skipped_duplicates: skippedDuplicates,
        });
      } catch (sourceErr: unknown) {
        const message = sourceErr instanceof Error ? sourceErr.message : "Erro desconhecido";

        await supabase
          .from("coupon_sources")
          .update({
            last_scan_at: nowIso,
            next_scan_at: nextScanAt,
            last_status: "error",
            last_error: message,
          })
          .eq("id", source.id);

        results.push({
          source_id: source.id,
          source_url: source.source_url,
          candidates_found: 0,
          evidence_inserted: 0,
          skipped_duplicates: 0,
        });
      }
    }

    return new Response(JSON.stringify({ success: true, checked_at: nowIso, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
