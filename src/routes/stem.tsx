import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Clock, Zap, Film } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SUBJECTS } from "@/lib/subjects";

export const Route = createFileRoute("/stem")({
  head: () => ({ meta: [{ title: "STEM — SIERRA" }] }),
  component: StemPage,
});

type Video = { id: string; title: string; subject: string; duration: string };

const shorts: Video[] = [
  { id: "s1", title: "Théorème de Pythagore en 60s", subject: "Maths", duration: "0:58" },
  { id: "s2", title: "Loi d'Ohm expliquée", subject: "Physique", duration: "1:12" },
  { id: "s3", title: "La photosynthèse", subject: "SVT", duration: "0:45" },
];

const longs: Video[] = [
  { id: "l1", title: "Cours complet : les fonctions", subject: "Maths", duration: "18:24" },
  { id: "l2", title: "Introduction à la mécanique", subject: "Physique", duration: "22:10" },
];

function StemPage() {
  const [active, setActive] = useState("Tout");

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <h1 className="text-3xl font-extrabold">STEM</h1>
        <p className="text-sm text-muted-foreground">Sciences, Technologie, Ingénierie, Mathématiques.</p>

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

        <section className="mt-7">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Zap className="h-5 w-5 text-gold" /> Shorts éducatifs
          </h2>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shorts.map((v) => (
              <article key={v.id} className="relative h-64 min-w-[160px] max-w-[160px] overflow-hidden rounded-2xl bg-surface">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20 backdrop-blur">
                    <Play className="h-5 w-5 fill-white text-white" />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-x-3 bottom-3">
                  <p className="line-clamp-2 text-sm font-bold text-white">{v.title}</p>
                  <p className="mt-1 text-xs text-white/70">{v.duration}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Film className="h-5 w-5 text-gold" /> Vidéos longues
          </h2>
          <div className="space-y-3">
            {longs.map((v) => (
              <article key={v.id} className="card-surface flex gap-3 overflow-hidden rounded-2xl p-3">
                <div className="relative grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface">
                  <div className="relative grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur">
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
          </div>
        </section>
      </div>
    </AppShell>
  );
}
