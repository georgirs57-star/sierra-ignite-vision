import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Award, BookOpen, Flame, LogOut, Settings, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profil — SIERRA" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div className="px-5 pt-6">
        <h1 className="text-3xl font-extrabold">Profil</h1>

        <div className="card-surface mt-5 flex items-center gap-4 rounded-3xl p-5">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gold-gradient text-2xl font-extrabold text-primary-foreground shadow-gold">
            A
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Aminata Diallo</h2>
            <p className="text-sm text-muted-foreground">Terminale S · Dakar</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: Flame, label: "Série", value: "12j" },
            { icon: BookOpen, label: "Leçons", value: "48" },
            { icon: Award, label: "Badges", value: "7" },
          ].map((s) => (
            <div key={s.label} className="card-surface rounded-2xl p-4 text-center">
              <s.icon className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-2 text-xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="card-surface mt-4 divide-y divide-border rounded-2xl">
          {[
            { icon: Settings, label: "Paramètres" },
            { icon: Award, label: "Mes accomplissements" },
            { icon: BookOpen, label: "Mes cours sauvegardés" },
          ].map((row) => (
            <button key={row.label} className="flex w-full items-center gap-3 px-4 py-4 text-left">
              <row.icon className="h-5 w-5 text-gold" />
              <span className="flex-1 text-sm font-medium">{row.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate({ to: "/login" })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-destructive/40 py-3.5 text-sm font-semibold text-destructive"
        >
          <LogOut className="h-4 w-4" /> Se déconnecter
        </button>
      </div>
    </AppShell>
  );
}
