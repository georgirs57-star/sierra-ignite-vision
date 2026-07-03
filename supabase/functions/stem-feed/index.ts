// SIERRA · stem-feed
// YouTube Data API v3 — feed éducatif (shorts + longs) par matière + niveau
// Secret requis : YOUTUBE_API_KEY
import { corsHeaders, json } from "../_shared/cors.ts";

type Body = {
  subject?: string;
  level?: string;
  query?: string;
  contentType?: "shorts" | "long" | "all";
  max?: number;
};

const SUBJECT_HINTS: Record<string, string> = {
  "Mathématiques": "mathématiques cours exercice",
  "Maths": "mathématiques cours exercice",
  "Physique-Chimie": "physique chimie cours",
  "SVT": "svt biologie géologie cours",
  "Technologie": "technologie collège lycée cours",
  "Informatique": "informatique programmation cours",
  "Histoire-Géographie": "histoire géographie cours",
  "Histoire-Géo": "histoire géographie cours",
  "Français": "français littérature cours",
  "Anglais": "anglais cours lycée",
  "Philosophie": "philosophie terminale cours",
  "Tout": "cours lycée éducation",
};

function parseIsoDuration(iso: string): number {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso ?? "");
  if (!m) return 0;
  const [, h, mm, s] = m;
  return (Number(h ?? 0) * 3600) + (Number(mm ?? 0) * 60) + Number(s ?? 0);
}

function fmt(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const apiKey = Deno.env.get("YOUTUBE_API_KEY");
  if (!apiKey) return json({ error: "YOUTUBE_API_KEY missing" }, 500);

  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    const subject = body.subject ?? "Tout";
    const level = body.level ?? "lycée";
    const contentType = body.contentType ?? "all";
    const max = Math.min(Math.max(body.max ?? 20, 5), 40);

    const hint = SUBJECT_HINTS[subject] ?? subject;
    const q = [body.query, hint, level, "Burkina OR francophone"].filter(Boolean).join(" ");

    const search = new URL("https://www.googleapis.com/youtube/v3/search");
    search.searchParams.set("part", "snippet");
    search.searchParams.set("q", q);
    search.searchParams.set("type", "video");
    search.searchParams.set("maxResults", String(max));
    search.searchParams.set("relevanceLanguage", "fr");
    search.searchParams.set("safeSearch", "strict");
    search.searchParams.set("videoEmbeddable", "true");
    search.searchParams.set("key", apiKey);

    const sres = await fetch(search);
    if (!sres.ok) return json({ error: "youtube_search_failed", detail: await sres.text() }, 502);
    const sjson = await sres.json();
    const ids: string[] = (sjson.items ?? []).map((i: any) => i.id?.videoId).filter(Boolean);
    if (!ids.length) return json({ shorts: [], longs: [], feed: [] });

    // Récupère durées / statistiques
    const details = new URL("https://www.googleapis.com/youtube/v3/videos");
    details.searchParams.set("part", "contentDetails,snippet");
    details.searchParams.set("id", ids.join(","));
    details.searchParams.set("key", apiKey);
    const dres = await fetch(details);
    const djson = await dres.json();

    const items = (djson.items ?? []).map((v: any) => {
      const dur = parseIsoDuration(v.contentDetails?.duration ?? "PT0S");
      const kind: "shorts" | "long" = dur > 0 && dur <= 90 ? "shorts" : "long";
      return {
        videoId: v.id,
        title: v.snippet?.title ?? "",
        description: v.snippet?.description ?? "",
        thumbnail:
          v.snippet?.thumbnails?.high?.url ??
          v.snippet?.thumbnails?.medium?.url ??
          v.snippet?.thumbnails?.default?.url ??
          "",
        channel: v.snippet?.channelTitle ?? "",
        subject,
        contentType: kind,
        duration: fmt(dur),
        durationSec: dur,
      };
    });

    const shorts = items.filter((i: any) => i.contentType === "shorts");
    const longs = items.filter((i: any) => i.contentType === "long");
    const feed = contentType === "shorts" ? shorts : contentType === "long" ? longs : items;

    return json({ shorts, longs, feed });
  } catch (e) {
    return json({ error: "internal", detail: String(e) }, 500);
  }
});
