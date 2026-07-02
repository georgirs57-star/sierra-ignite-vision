import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import splash from "@/assets/splash-sierra.png";

export const Route = createFileRoute("/")({
  component: SplashScreen,
});

function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 55);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const to = setTimeout(() => navigate({ to: "/login", replace: true }), 500);
      return () => clearTimeout(to);
    }
  }, [progress, navigate]);

  const skip = () => navigate({ to: "/login", replace: true });

  return (
    <div onClick={skip} className="relative min-h-screen overflow-hidden bg-black cursor-pointer">

      {/* Full-bleed hero artwork */}
      <img
        src={splash}
        alt="SIERRA"
        className="absolute inset-0 h-full w-full object-cover animate-drift-in"
        width={1024}
        height={1900}
      />
      {/* Vignette + bottom fade so the progress reads over the art */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_60%_at_50%_100%,rgba(0,0,0,0.65),transparent_60%)]" />

      {/* Twinkling stars overlay */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-[3px] w-[3px] rounded-full bg-white animate-twinkle"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              animationDelay: `${(i % 6) * 0.4}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Bottom progress block */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-8 pb-10">
        <div className="mx-auto w-full max-w-xs space-y-3 text-center">
          <p className="text-sm tracking-wide text-white/85">Chargement de l'Académie...</p>
          <div className="flex items-center gap-3">
            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full border border-gold/50 bg-black/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-electric via-cyan-400 to-gold transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{ transform: `translateX(${progress * 3}%)` }}
              />
            </div>
            <span className="text-xs font-bold text-gold">{progress}%</span>
          </div>
          <p className="pt-1 text-xs text-gold/90">
            ✦ Ton voyage de savoir commence ici.
          </p>
        </div>
      </div>
    </div>
  );
}
