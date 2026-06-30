import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import splashBg from "@/assets/splash-bg.jpg";
import emblem from "@/assets/sierra-emblem.jpg";

export const Route = createFileRoute("/")({
  component: SplashScreen,
});

function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => Math.min(100, p + 2));
    }, 60);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const to = setTimeout(() => navigate({ to: "/login" }), 400);
      return () => clearTimeout(to);
    }
  }, [progress, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src={splashBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        width={1024}
        height={1536}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background/95" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 py-16">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="relative mb-8 animate-float-up">
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gold/30 blur-3xl" />
            <img
              src={emblem}
              alt="SIERRA"
              className="relative h-44 w-44 rounded-full object-cover mix-blend-screen"
              width={200}
              height={200}
            />
          </div>
          <h1 className="animate-float-up text-5xl font-extrabold tracking-[0.2em] text-gold drop-shadow-[0_2px_20px_rgba(244,197,66,0.5)]">
            SIERRA
          </h1>
          <div className="mt-2 h-px w-16 bg-gold/60" />
          <div className="mt-8 space-y-1 text-sm font-semibold uppercase tracking-[0.25em] text-foreground/90">
            <p className="animate-float-up" style={{ animationDelay: "0.1s" }}>Apprendre.</p>
            <p className="animate-float-up" style={{ animationDelay: "0.25s" }}>Comprendre.</p>
            <p className="animate-float-up text-gold" style={{ animationDelay: "0.4s" }}>
              Construire l'Afrique de demain.
            </p>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-3">
          <p className="text-center text-xs tracking-wide text-foreground/80">
            Chargement de l'Académie...
          </p>
          <div className="flex items-center gap-3">
            <div className="relative h-2 flex-1 overflow-hidden rounded-full border border-gold/40 bg-background/40">
              <div
                className="h-full bg-gradient-to-r from-electric to-gold transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-gold">{progress}%</span>
          </div>
          <p className="pt-2 text-center text-xs text-gold/80">
            ✦ Ton voyage de savoir commence ici.
          </p>
        </div>
      </div>
    </div>
  );
}
