const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ICAL_URL =
  Deno.env.get('AIRBNB_ICAL_URL') ??
  'https://www.airbnb.com.br/calendar/ical/1594363689685177500.ics?t=dbe3c4b6365b4452a66385239c1c55f6';

const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

interface CacheEntry {
  fetchedAt: number;
  blockedDates: string[]; // YYYY-MM-DD (each blocked night)
}

let cache: CacheEntry | null = null;

/** Parse YYYYMMDD (all-day) or YYYYMMDDTHHmmssZ from iCal. */
function parseIcalDate(value: string): Date | null {
  const v = value.trim();
  const dateOnly = /^(\d{4})(\d{2})(\d{2})$/.exec(v);
  if (dateOnly) {
    return new Date(Date.UTC(+dateOnly[1], +dateOnly[2] - 1, +dateOnly[3]));
  }
  const dt = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/.exec(v);
  if (dt) {
    return new Date(
      Date.UTC(+dt[1], +dt[2] - 1, +dt[3], +dt[4], +dt[5], +dt[6])
    );
  }
  return null;
}

function toISODate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Parse iCal text and return the set of blocked night dates (YYYY-MM-DD).
 * Airbnb VEVENT DTEND is exclusive (checkout day), so we exclude it.
 */
function parseIcal(ics: string): string[] {
  const blocked = new Set<string>();
  // Unfold long lines (RFC 5545: lines starting with space/tab are continuations)
  const unfolded = ics.replace(/\r?\n[ \t]/g, '');
  const lines = unfolded.split(/\r?\n/);

  let inEvent = false;
  let dtStart: Date | null = null;
  let dtEnd: Date | null = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      dtStart = null;
      dtEnd = null;
      continue;
    }
    if (line === 'END:VEVENT') {
      if (inEvent && dtStart && dtEnd) {
        const cur = new Date(dtStart);
        while (cur < dtEnd) {
          blocked.add(toISODate(cur));
          cur.setUTCDate(cur.getUTCDate() + 1);
        }
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;

    // Match DTSTART or DTEND, optionally with ;VALUE=DATE or ;TZID=... params
    const m = /^(DTSTART|DTEND)(?:;[^:]*)?:(.+)$/.exec(line);
    if (!m) continue;
    const date = parseIcalDate(m[2]);
    if (!date) continue;
    if (m[1] === 'DTSTART') dtStart = date;
    else dtEnd = date;
  }

  return Array.from(blocked).sort();
}

async function getBlockedDates(forceRefresh = false): Promise<{
  blockedDates: string[];
  cachedAt: number;
  stale: boolean;
}> {
  const now = Date.now();
  if (!forceRefresh && cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return { blockedDates: cache.blockedDates, cachedAt: cache.fetchedAt, stale: false };
  }

  try {
    const res = await fetch(ICAL_URL, {
      headers: { 'User-Agent': 'PontalSereias/1.0 (+https://pontalsereias.com.br)' },
    });
    if (!res.ok) throw new Error(`Airbnb iCal HTTP ${res.status}`);
    const ics = await res.text();
    const blockedDates = parseIcal(ics);
    cache = { fetchedAt: now, blockedDates };
    return { blockedDates, cachedAt: now, stale: false };
  } catch (err) {
    console.error('Failed to fetch Airbnb iCal:', err);
    if (cache) {
      // Serve stale cache when remote is unavailable
      return { blockedDates: cache.blockedDates, cachedAt: cache.fetchedAt, stale: true };
    }
    throw err;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const refresh = url.searchParams.get('refresh') === '1';
    const { blockedDates, cachedAt, stale } = await getBlockedDates(refresh);
    return new Response(
      JSON.stringify({
        blockedDates,
        cachedAt: new Date(cachedAt).toISOString(),
        stale,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return new Response(
      JSON.stringify({ error: message, blockedDates: [] }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

export { parseIcal };