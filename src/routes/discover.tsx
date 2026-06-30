import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, TrendingUp, Clock } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Découvrir — SIERRA" }] }),
  component: DiscoverPage,
});

const subjects = ["Tout", "Maths", "Physique-Chimie", "SVT", "Histoire-Géo", "Français", "Anglais", "Technologie"];

const results = [
  { subject: "Maths", title: "Le théorème de Thalès expliqué simplement", desc: "Une démonstration visuelle adaptée aux lycéens.", time: "5 min", tone: "from-amber-500/30 to-orange-500/10" },
  { subject: "Physique-Chimie", title: "Pourquoi le ciel est-il bleu ?", desc: "La diffusion de Rayleigh, accessible à tous.", time: "7 min", tone: "from-sky-500/30 to-indigo-500/10" },
  { subject: "SVT", title: "Le fonctionnement du système immunitaire", desc: "Comment notre corps combat les virus.", time: "9 min", tone: "from-emerald-500/30 to-teal-500/10" },
  { subject: "Histoire-Géo", title: "Les grands empires africains", desc: "Mali, Songhaï, Ghana — un héritage puissant.", time: "12 min", tone: "from-yellow-500/30 to-rose-500/10" },
  { subject: "Technologie", title: "Comprendre les réseaux neuronaux", desc: "Les bases de l'apprentissage automatique.", time: "10 min", tone: "from-violet-500/30 to-fuchsia-500/10" },
  { subject: "Français", title: "L'art de l'argumentation", desc: "Construire un raisonnement convaincant.", time: "6 min", tone: "from-rose-500/30 to-amber-500/10" },
];

function DiscoverPage() {
  const [active, setActive] = useState("Tout");
  const filtered = active === "Tout" ? results : results.filter((r) => r.subject === active);

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <h1 className="text-3xl font-extrabold">Découvrir</h1>
        <p className="text-sm text-muted-foreground">Explore des sujets passionnants.</p>

        {/* Search */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-surface/60 px-4 py-3.5 backdrop-blur focus-within:border-gold/70">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            placeholder="Rechercher un cours, une matière, un concept..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
          />
        </div>

        {/* Tabs */}
        <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active === s
                  ? "border-gold bg-gold-gradient text-primary-foreground shadow-gold"
                  : "border-border bg-surface/60 text-foreground/80 hover:border-gold/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Featured */}
        <section className="mt-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-gold" /> Tendances
          </h2>
          <div className="space-y-3">
            {filtered.map((r) => (
              <article
                key={r.title}
                className="card-surface relative overflow-hidden rounded-2xl p-4 transition active:scale-[0.99]"
              >
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${r.tone} blur-2xl`} />
                <div className="relative">
                  <span className="inline-block rounded-full border border-gold/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                    {r.subject}
                  </span>
                  <h3 className="mt-2 text-base font-bold leading-snug">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {r.time} de lecture
                  </div>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Aucun résultat pour cette matière pour le moment.
              </p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
