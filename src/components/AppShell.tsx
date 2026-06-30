import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, Atom, MessageCircle, User } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/home", label: "Accueil", icon: Home },
  { to: "/discover", label: "Découvrir", icon: Compass },
  { to: "/stem", label: "STEM", icon: Atom },
  { to: "/chat", label: "SIERRA", icon: MessageCircle },
  { to: "/profile", label: "Profil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-28">
      {children}
      <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md px-4 pb-4">
        <div className="card-surface flex items-center justify-around rounded-3xl px-2 py-3 backdrop-blur-xl">
          {tabs.map((t) => {
            const active = pathname === t.to || (t.to !== "/profile" && pathname.startsWith(t.to));
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="group relative flex w-16 flex-col items-center gap-1 py-1"
              >
                <Icon
                  className={`h-6 w-6 transition ${active ? "text-gold" : "text-muted-foreground group-hover:text-foreground"}`}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span
                  className={`text-[11px] font-medium transition ${active ? "text-gold" : "text-muted-foreground"}`}
                >
                  {t.label}
                </span>
                {active && (
                  <span className="absolute -bottom-1 h-1 w-6 rounded-full bg-gold shadow-gold" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
