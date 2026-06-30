import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ArrowRight, Flame, BookMarked, Bot, Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import emblem from "@/assets/sierra-emblem.jpg";
import trendLightning from "@/assets/trend-lightning.jpg";
import trendAfrica from "@/assets/trend-africa.jpg";
import trendAI from "@/assets/trend-ai.jpg";
import coursePhysics from "@/assets/course-physics.jpg";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Accueil — SIERRA" }] }),
  component: HomePage,
});

const trends = [
  { title: "Pourquoi les éclairs existent-ils ?", tag: "Sciences", tagClass: "text-purple-300", img: trendLightning },
  { title: "Les inventions africaines qui ont changé le monde", tag: "Afrique", tagClass: "text-gold", img: trendAfrica },
  { title: "Comment fonctionne l'intelligence artificielle ?", tag: "Technologie", tagClass: "text-electric", img: trendAI },
];

function HomePage() {
  return (
    <AppShell>
      <div className="px-5 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Accueil</h1>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-gold/40 bg-surface">
              <div className="grid h-full w-full place-items-center text-gold font-bold">A</div>
            </div>
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-surface/60">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-bold">Bonjour, Aminata !</h2>
          <p className="text-sm text-muted-foreground">Prête à apprendre aujourd'hui ?</p>
        </div>

        {/* Hero banner */}
        <div className="card-surface mt-5 relative overflow-hidden rounded-3xl border-gold/40 p-5">
          <div className="absolute -right-6 -top-6 h-44 w-44 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gold leading-tight">Ton voyage de savoir</h3>
              <p className="mt-1 text-sm text-foreground/80">continue avec SIERRA</p>
              <Link
                to="/discover"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold"
              >
                Explorer maintenant <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <img src={emblem} alt="" className="h-28 w-28 rounded-full object-cover mix-blend-screen" width={200} height={200} loading="lazy" />
          </div>
        </div>

        {/* Trends */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Flame className="h-5 w-5 text-gold" />
              Tendances du jour
            </h3>
            <button className="text-sm font-semibold text-gold">Voir tout</button>
          </div>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {trends.map((t) => (
              <article key={t.title} className="card-surface min-w-[180px] max-w-[180px] overflow-hidden rounded-2xl">
                <img src={t.img} alt={t.title} className="h-28 w-full object-cover" width={400} height={300} loading="lazy" />
                <div className="p-3">
                  <p className="line-clamp-3 text-sm font-semibold leading-snug">{t.title}</p>
                  <p className={`mt-2 text-xs font-semibold ${t.tagClass}`}>{t.tag}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Continue learning */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <BookMarked className="h-5 w-5 text-gold" />
              Continuer l'apprentissage
            </h3>
            <button className="text-sm font-semibold text-gold">Voir tout</button>
          </div>
          <div className="card-surface flex items-center gap-3 rounded-2xl p-3">
            <img src={coursePhysics} alt="" className="h-16 w-16 rounded-xl object-cover" width={200} height={200} loading="lazy" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">Les bases de la physique</p>
              <p className="truncate text-xs text-muted-foreground">Chapitre 2 — Mécanique</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full w-[55%] bg-gradient-to-r from-electric to-gold" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">55%</span>
              </div>
            </div>
            <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-electric text-white">
              <Play className="h-5 w-5 fill-current" />
            </button>
          </div>
        </section>

        {/* Assistant SIERRA */}
        <section className="mt-8">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Bot className="h-5 w-5 text-gold" />
            Assistant SIERRA
          </h3>
          <div className="card-surface relative overflow-hidden rounded-3xl p-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gold/30 blur-2xl" />
                <img src={emblem} alt="" className="relative h-20 w-20 rounded-full object-cover mix-blend-screen" width={200} height={200} loading="lazy" />
              </div>
              <p className="flex-1 text-sm leading-relaxed">
                Pose-moi n'importe quelle question.
                <br />
                Je suis là pour t'aider.
              </p>
            </div>
            <Link
              to="/chat"
              className="mt-4 flex w-full items-center justify-center rounded-full border border-gold/50 px-4 py-3 text-sm font-semibold text-gold"
            >
              Discuter avec SIERRA
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
