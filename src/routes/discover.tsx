import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Sparkles,
  Compass,
  Cpu,
  FlaskConical,
  Globe2,
  Landmark,
  BookOpen,
  Languages,
  Sigma,
  ArrowUpRight,
  Bookmark,
  Share2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Découvrir — SIERRA" }] }),
  component: DiscoverPage,
});

const subjects = [
  { key: "Pour toi", icon: Sparkles },
  { key: "Maths", icon: Sigma },
  { key: "Physique-Chimie", icon: FlaskConical },
  { key: "SVT", icon: Compass },
  { key: "Histoire-Géo", icon: Landmark },
  { key: "Français", icon: BookOpen },
  { key: "Anglais", icon: Languages },
  { key: "Technologie", icon: Cpu },
  { key: "Monde", icon: Globe2 },
];

type Story = {
  subject: string;
  title: string;
  desc: string;
  time: string;
  source: string;
  readers: string;
  hero: string; // gradient
  featured?: boolean;
};

const stories: Story[] = [
  {
    subject: "Physique",
    title: "Pourquoi le ciel devient rouge au coucher du soleil",
    desc: "La diffusion de Rayleigh expliquée avec des schémas simples et une expérience à faire chez soi.",
    time: "6 min",
    source: "SIERRA · Sciences",
    readers: "12,4k lecteurs",
    hero: "from-orange-500/40 via-rose-500/25 to-indigo-600/40",
    featured: true,
  },
  {
    subject: "Maths",
    title: "Thalès, mais vraiment intuitif",
    desc: "Une démonstration visuelle qui rend le théorème évident.",
    time: "5 min",
    source: "Prof. Diallo",
    readers: "3,1k",
    hero: "from-amber-400/40 to-yellow-600/20",
  },
  {
    subject: "SVT",
    title: "Comment le corps combat un virus",
    desc: "Le système immunitaire raconté comme une bataille tactique.",
    time: "9 min",
    source: "SIERRA · Bio",
    readers: "8,7k",
    hero: "from-emerald-400/40 to-teal-600/20",
  },
  {
    subject: "Histoire",
    title: "Les grands empires africains",
    desc: "Mali, Songhaï, Ghana — l'héritage qui a façonné un continent.",
    time: "12 min",
    source: "SIERRA · Héritage",
    readers: "21k",
    hero: "from-yellow-500/40 to-rose-600/25",
  },
  {
    subject: "Tech",
    title: "Comprendre les réseaux neuronaux",
    desc: "Les bases de l'apprentissage automatique, sans jargon.",
    time: "10 min",
    source: "SIERRA · IA",
    readers: "6,4k",
    hero: "from-violet-500/40 to-fuchsia-600/25",
  },
  {
    subject: "Français",
    title: "L'art de l'argumentation",
    desc: "Construire un raisonnement qui convainc, étape par étape.",
    time: "6 min",
    source: "Prof. Sarr",
    readers: "2,9k",
    hero: "from-rose-500/40 to-amber-500/20",
  },
];

const asks = [
  "Explique la relativité restreinte comme si j'avais 15 ans",
  "Résume la Guerre froide en 5 points",
  "Comment mémoriser le tableau périodique ?",
  "Différence entre mitose et méiose",
];

function DiscoverPage() {
  const [active, setActive] = useState("Pour toi");
  const [featured, ...rest] = stories;

  return (
    <AppShell>
      <div className="pb-4">
        {/* Header */}
        <header className="sticky top-0 z-30 -mx-0 border-b border-white/5 bg-background/70 px-5 pb-3 pt-6 backdrop-blur-xl">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/80">
                Fil du jour
              </p>
              <h1 className="mt-1 font-display text-3xl font-extrabold leading-none">
                Découvrir
              </h1>
            </div>
            <button
              aria-label="Recherche"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-surface/70"
            >
              <Search className="h-4 w-4 text-foreground/80" />
            </button>
          </div>

          {/* Ask bar (Perplexity-like) */}
          <div className="group mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/70 px-3.5 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] focus-within:border-gold/60">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-gold-gradient">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <input
              placeholder="Pose ta question à SIERRA…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
              ⌘K
            </kbd>
          </div>

          {/* Category rail */}
          <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {subjects.map(({ key, icon: Icon }) => {
              const on = active === key;
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`group flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${
                    on
                      ? "border-gold/70 bg-gold/15 text-gold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                      : "border-white/10 bg-surface/50 text-foreground/70 hover:border-gold/30 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${on ? "text-gold" : "text-foreground/60"}`} />
                  {key}
                </button>
              );
            })}
          </div>
        </header>

        {/* Featured hero card */}
        <section className="px-5 pt-5">
          <article className="group relative overflow-hidden rounded-3xl border border-white/10 animate-float-up">
            <div className={`absolute inset-0 bg-gradient-to-br ${featured.hero}`} />
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,transparent,rgba(0,0,0,0.65))]" />
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl animate-pulse-glow" />

            <div className="relative flex min-h-[280px] flex-col justify-between p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-black/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gold backdrop-blur">
                  <Sparkles className="h-3 w-3" /> À la une
                </span>
                <span className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/80 backdrop-blur">
                  {featured.subject}
                </span>
              </div>

              <div>
                <h2 className="font-display text-2xl font-extrabold leading-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
                  {featured.title}
                </h2>
                <p className="mt-2 max-w-md text-sm text-white/80">{featured.desc}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-white/70">
                    <span className="font-semibold text-white/90">{featured.source}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {featured.time}
                    </span>
                    <span className="hidden sm:inline">· {featured.readers}</span>
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-bold text-black transition group-hover:bg-white"
                  >
                    Lire <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Ask suggestions */}
        <section className="px-5 pt-6">
          <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Questions inspirantes
          </h3>
          <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {asks.map((q) => (
              <button
                key={q}
                className="group relative flex w-64 shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-surface/60 p-3.5 text-left transition hover:border-gold/40"
              >
                <div className="flex items-center gap-2">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-gold/15 ring-1 ring-gold/30">
                    <Sparkles className="h-3 w-3 text-gold" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Demander
                  </span>
                </div>
                <p className="mt-3 text-[13px] font-semibold leading-snug text-foreground/95">
                  {q}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-gold/90">
                  Explorer <ArrowUpRight className="h-3 w-3" />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Feed */}
        <section className="px-5 pt-6">
          <h3 className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-gold" /> Tendances aujourd'hui
            </span>
            <span className="font-semibold normal-case tracking-normal text-muted-foreground/70">
              {rest.length} histoires
            </span>
          </h3>

          <div className="space-y-3">
            {rest.map((s, i) => (
              <article
                key={s.title}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-float-up group relative overflow-hidden rounded-2xl border border-white/8 bg-surface/50 p-4 transition hover:border-gold/40 hover:bg-surface/70"
              >
                <div className={`pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-gradient-to-br ${s.hero} opacity-70 blur-3xl transition group-hover:opacity-100`} />
                <div className="relative flex gap-4">
                  {/* thumbnail tile */}
                  <div className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${s.hero} ring-1 ring-white/10`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
                    <span className="absolute bottom-1 left-1 rounded-md bg-black/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      {s.subject}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-2 text-[15px] font-bold leading-snug text-foreground">
                      {s.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-[12.5px] text-muted-foreground">
                      {s.desc}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground/80">{s.source}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {s.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button aria-label="Sauvegarder" className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition hover:bg-white/5 hover:text-gold">
                          <Bookmark className="h-3.5 w-3.5" />
                        </button>
                        <button aria-label="Partager" className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition hover:bg-white/5 hover:text-gold">
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center">
            <button className="rounded-full border border-white/10 bg-surface/60 px-4 py-2 text-xs font-semibold text-foreground/80 transition hover:border-gold/40 hover:text-gold">
              Charger plus d'histoires
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
