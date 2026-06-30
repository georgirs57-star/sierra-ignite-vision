import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Clock, Zap, Film } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/stem")({
  head: () => ({ meta: [{ title: "STEM — SIERRA" }] }),
  component: StemPage,
});

const subjects = ["Tout", "Maths", "Physique-Chimie", "SVT", "Histoire-Géo", "Français", "Anglais", "Technologie"];

const shorts = [
  { title: "Pythagore en 60 sec", subject: "Maths", duration: "0:58", tone: "from-amber-500 to-orange-600" },
  { title: "L'ADN décodé", subject: "SVT", duration: "0:45", tone: "from-emerald-500 to-teal-600" },
  { title: "Loi d'Ohm", subject: "Physique-Chimie", duration: "1:02", tone: "from-sky-500 to-indigo-600" },
  { title: "Trigonométrie astuce", subject: "Maths", duration: "0:50", tone: "from-rose-500 to-fuchsia-600" },
  { title: "Réactions chimiques", subject: "Physique-Chimie", duration: "0:48", tone: "from-purple-500 to-violet-600" },
];

const longs = [
  { title: "Cours complet — Fonctions du second degré", subject: "Maths", duration: "32:14", tone: "from-amber-500/40 to-orange-500/20" },
  { title: "L'évolution des espèces — Darwin et après", subject: "SVT", duration: "47:02", tone: "from-emerald-500/40 to-teal-500/20" },
  { title: "Mécanique quantique — Introduction", subject: "Physique-Chimie", duration: "55:48", tone: "from-sky-500/40 to-indigo-500/20" },
  { title: "L'histoire de l'informatique", subject: "Technologie", duration: "41:22", tone: "from-violet-500/40 to-fuchsia-500/20" },
];

function StemPage() {
  const [active, setActive] = useState("Tout");
  const fs = active === "Tout" ? shorts : shorts.filter((s) => s.subject === active);
  const fl = active === "Tout" ? longs : longs.filter((s) => s.subject === active);

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <h1 className="text-3xl font-extrabold">STEM</h1>
        <p className="text-sm text-muted-foreground">Science, Technologie, Ingénierie, Maths.</p>

        {/* Subject tabs */}
        <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active === s
                  ? "border-gold bg-gold-gradient text-primary-foreground shadow-gold"
                  : "border-border bg-surface/60 text-foreground/80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Shorts */}
        <section className="mt-7">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Zap className="h-5 w-5 text-gold" /> Shorts éducatifs
          </h2>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {fs.map((s) => (
              <article
                key={s.title}
                className={`relative h-64 min-w-[160px] max-w-[160px] overflow-hidden rounded-2xl bg-gradient-to-br ${s.tone}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20 backdrop-blur">
                    <Play className="h-5 w-5 fill-white text-white" />
                  </div>
                </div>
                <div className="absolute inset-x-3 bottom-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{s.subject}</p>
                  <p className="line-clamp-2 text-sm font-bold text-white">{s.title}</p>
                  <p className="mt-1 text-xs text-white/70">{s.duration}</p>
                </div>
              </article>
            ))}
            {fs.length === 0 && <p className="py-6 text-sm text-muted-foreground">Aucun short pour cette matière.</p>}
          </div>
        </section>

        {/* Longs */}
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Film className="h-5 w-5 text-gold" /> Vidéos longues
          </h2>
          <div className="space-y-3">
            {fl.map((v) => (
              <article key={v.title} className="card-surface flex gap-3 overflow-hidden rounded-2xl p-3">
                <div className={`relative grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br ${v.tone}`}>
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {v.duration}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full border border-gold/40 px-2 py-0.5 text-[10px] font-bold uppercase text-gold">
                    {v.subject}
                  </span>
                  <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug">{v.title}</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {v.duration}
                  </div>
                </div>
              </article>
            ))}
            {fl.length === 0 && <p className="py-6 text-sm text-muted-foreground">Aucune vidéo longue pour cette matière.</p>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
