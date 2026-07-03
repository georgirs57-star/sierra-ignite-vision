import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { invokeEdgeFunction } from "@/lib/supabase";
import { SUBJECTS } from "@/lib/subjects";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Découvrir — SIERRA" }] }),
  component: DiscoverPage,
});

type DiscoverResp = { answer: string; sources: { title: string; url: string }[] };

const asks = [
  "Explique la relativité restreinte comme si j'avais 15 ans",
  "Résume la Guerre froide en 5 points",
  "Comment mémoriser le tableau périodique ?",
  "Différence entre mitose et méiose",
];

function DiscoverPage() {
  const { profile } = useAuth();
  const [active, setActive] = useState("Tout");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const ask = async (q?: string) => {
    const content = (q ?? query).trim();
    if (!content) return;
    setQuery(content);
    setLoading(true);
    setError(null);
    setAnswer("");
    setSources([]);
    try {
      const data = await invokeEdgeFunction<DiscoverResp>("discover-feed", {
        query: content,
        subject: active,
        level: profile?.level ?? "Seconde C",
      });
      setAnswer(data.answer ?? "");
      setSources(data.sources ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de recherche");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="pb-4">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-background/70 px-5 pb-3 pt-6 backdrop-blur-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/80">Découvrir</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-none">
            Explore avec <span className="text-gold">SIERRA</span>
          </h1>

          <form
            onSubmit={(e) => { e.preventDefault(); void ask(); }}
            className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/70 px-3.5 py-3 focus-within:border-gold/60"
          >
            <div className="grid h-7 w-7 place-items-center rounded-full bg-gold-gradient">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Pose ta question sur ${active}…`}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            <button type="submit" disabled={loading} className="grid h-8 w-8 place-items-center rounded-full bg-gold-gradient text-primary-foreground disabled:opacity-40">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </button>
          </form>

          <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SUBJECTS.map(({ key, label, icon: Icon }) => {
              const on = active === key;
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${
                    on
                      ? "border-gold/70 bg-gold/15 text-gold"
                      : "border-white/10 bg-surface/50 text-foreground/70"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </header>

        {!answer && !loading && (
          <section className="px-5 pt-6">
            <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Questions inspirantes
            </h3>
            <div className="grid gap-2.5">
              {asks.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-surface/60 p-3.5 text-left transition hover:border-gold/40"
                >
                  <span className="text-[13px] font-semibold text-foreground/95">{q}</span>
                  <Sparkles className="h-4 w-4 text-gold/80" />
                </button>
              ))}
            </div>
          </section>
        )}

        {error && (
          <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-300">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        {(loading || answer) && (
          <section className="px-5 pt-6">
            <div className="card-surface rounded-3xl p-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gold/90">
                Réponse SIERRA · {active}
              </p>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-gold" /> SIERRA cherche et rédige…
                </div>
              )}
              {answer && (
                <article className="whitespace-pre-wrap text-[14px] leading-relaxed text-foreground/95">
                  {answer}
                </article>
              )}
            </div>

            {sources.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sources</h4>
                <ul className="space-y-2">
                  {sources.map((s, i) => (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start gap-2 rounded-xl border border-white/10 bg-surface/50 p-3 text-[12.5px] text-foreground/90 hover:border-gold/40"
                      >
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                        <span className="line-clamp-2">{s.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}
