import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SUBJECTS } from "@/lib/subjects";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Découvrir — SIERRA" }] }),
  component: DiscoverPage,
});

const asks = [
  "Explique la relativité restreinte comme si j'avais 15 ans",
  "Résume la Guerre froide en 5 points",
  "Comment mémoriser le tableau périodique ?",
  "Différence entre mitose et méiose",
];

function DiscoverPage() {
  const [active, setActive] = useState("Tout");
  const [query, setQuery] = useState("");

  return (
    <AppShell>
      <div className="pb-4">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-background/70 px-5 pb-3 pt-6 backdrop-blur-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/80">Découvrir</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-none">
            Explore avec <span className="text-gold">SIERRA</span>
          </h1>

          <form
            onSubmit={(e) => e.preventDefault()}
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
            <button type="submit" className="grid h-8 w-8 place-items-center rounded-full bg-gold-gradient text-primary-foreground">
              <Search className="h-4 w-4" />
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

        <section className="px-5 pt-6">
          <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Questions inspirantes
          </h3>
          <div className="grid gap-2.5">
            {asks.map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-surface/60 p-3.5 text-left transition hover:border-gold/40"
              >
                <span className="text-[13px] font-semibold text-foreground/95">{q}</span>
                <Sparkles className="h-4 w-4 text-gold/80" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
