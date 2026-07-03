import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Clock, Zap, Film, Loader2, AlertCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase, invokeEdgeFunction } from "@/lib/supabase";
import { SUBJECTS } from "@/lib/subjects";
import { useAuth, logXp } from "@/hooks/useAuth";

export const Route = createFileRoute("/stem")({
  head: () => ({ meta: [{ title: "STEM — SIERRA" }] }),
  component: StemPage,
});

type Video = {
  videoId: string;
  title: string;
  thumbnail: string;
  subject: string;
  contentType: "shorts" | "long";
  duration: string;
  channel?: string;
};

type StemResp = { shorts?: Video[]; longs?: Video[]; feed?: Video[] };

function StemPage() {
  const { user, profile } = useAuth();
  const [active, setActive] = useState("Tout");
  const [shorts, setShorts] = useState<Video[]>([]);
  const [longs, setLongs] = useState<Video[]>([]);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("favorites").select("video_id").eq("user_id", user.id).then(({ data }) => {
      setFavIds(new Set((data ?? []).map((r: any) => r.video_id)));
    });
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await invokeEdgeFunction<StemResp>("stem-feed", {
          subject: active,
          level: profile?.level ?? "Seconde C",
        });
        if (cancelled) return;
        setShorts(data?.shorts ?? []);
        setLongs(data?.longs ?? []);
        setError(null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur d'alimentation");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [active, profile?.level]);

  const openVideo = async (v: Video) => {
    if (user) {
      await supabase.from("stem_history").insert({
        user_id: user.id,
        video_id: v.videoId,
        subject: v.subject,
        content_type: v.contentType,
        title: v.title,
        thumbnail: v.thumbnail,
      });
      void logXp(user.id, `watch_${v.contentType}`, v.contentType === "shorts" ? 2 : 10);
    }
    window.open(`https://www.youtube.com/watch?v=${v.videoId}`, "_blank");
  };

  const toggleFav = async (v: Video) => {
    if (!user) return;
    if (favIds.has(v.videoId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("video_id", v.videoId);
      setFavIds((s) => { const n = new Set(s); n.delete(v.videoId); return n; });
    } else {
      await supabase.from("favorites").insert({
        user_id: user.id, video_id: v.videoId, subject: v.subject, title: v.title, thumbnail: v.thumbnail,
      });
      setFavIds((s) => new Set(s).add(v.videoId));
      void logXp(user.id, "favorite", 1);
    }
  };

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold">
          STEM {loading && <Loader2 className="h-5 w-5 animate-spin text-gold" />}
        </h1>
        <p className="text-sm text-muted-foreground">Sciences, Technologie, Ingénierie, Mathématiques.</p>
        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-400/90">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </p>
        )}

        <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SUBJECTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                active === s.key
                  ? "border-gold bg-gold-gradient text-primary-foreground shadow-gold"
                  : "border-border bg-surface/60 text-foreground/80"
              }`}
            >
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </button>
          ))}
        </div>

        {/* Shorts */}
        <section className="mt-7">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Zap className="h-5 w-5 text-gold" /> Shorts éducatifs
          </h2>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shorts.map((v) => (
              <article key={v.videoId} className="relative h-64 min-w-[160px] max-w-[160px] overflow-hidden rounded-2xl bg-surface">
                <img src={v.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <button onClick={() => openVideo(v)} className="absolute inset-0 grid place-items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20 backdrop-blur">
                    <Play className="h-5 w-5 fill-white text-white" />
                  </div>
                </button>
                <button onClick={() => toggleFav(v)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/50 backdrop-blur">
                  {favIds.has(v.videoId)
                    ? <BookmarkCheck className="h-4 w-4 text-gold" />
                    : <Bookmark className="h-4 w-4 text-white" />}
                </button>
                <div className="pointer-events-none absolute inset-x-3 bottom-3">
                  <p className="line-clamp-2 text-sm font-bold text-white">{v.title}</p>
                  <p className="mt-1 text-xs text-white/70">{v.duration}</p>
                </div>
              </article>
            ))}
            {!loading && shorts.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">Aucun short pour cette matière.</p>
            )}
          </div>
        </section>

        {/* Longs */}
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Film className="h-5 w-5 text-gold" /> Vidéos longues
          </h2>
          <div className="space-y-3">
            {longs.map((v) => (
              <article key={v.videoId} className="card-surface flex gap-3 overflow-hidden rounded-2xl p-3">
                <button onClick={() => openVideo(v)} className="relative grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface">
                  <img src={v.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <div className="relative grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {v.duration}
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block rounded-full border border-gold/40 px-2 py-0.5 text-[10px] font-bold uppercase text-gold">
                      {v.subject}
                    </span>
                    <button onClick={() => toggleFav(v)} className="text-muted-foreground">
                      {favIds.has(v.videoId)
                        ? <BookmarkCheck className="h-4 w-4 text-gold" />
                        : <Bookmark className="h-4 w-4" />}
                    </button>
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug">{v.title}</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {v.duration}
                    {v.channel && <span className="truncate">· {v.channel}</span>}
                  </div>
                </div>
              </article>
            ))}
            {!loading && longs.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">Aucune vidéo longue pour cette matière.</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
