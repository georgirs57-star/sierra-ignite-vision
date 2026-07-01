import { useEffect, useState } from "react";
import sphereDay from "@/assets/sphere-day.jpg";
import sphereNight from "@/assets/sphere-night.jpg";

export function useIsDay() {
  const [isDay, setIsDay] = useState(() => {
    const h = new Date().getHours();
    return h >= 6 && h < 19;
  });
  useEffect(() => {
    const t = setInterval(() => {
      const h = new Date().getHours();
      setIsDay(h >= 6 && h < 19);
    }, 60_000);
    return () => clearInterval(t);
  }, []);
  return isDay;
}

type Props = {
  size?: number;
  className?: string;
  forceMode?: "day" | "night";
};

/**
 * SIERRA energy sphere. Gold (day) / electric blue (night).
 * The image is layered on solid black and blended with `screen` so the
 * black background disappears against dark UI surfaces.
 */
export function SierraSphere({ size = 160, className = "", forceMode }: Props) {
  const auto = useIsDay();
  const isDay = forceMode ? forceMode === "day" : auto;
  const src = isDay ? sphereDay : sphereNight;
  const glow = isDay ? "bg-gold/40" : "bg-electric/50";

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <div className={`absolute inset-0 animate-pulse-glow rounded-full blur-3xl ${glow}`} />
      <div className="absolute inset-0 animate-spin-slow">
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          className="h-full w-full rounded-full object-cover mix-blend-screen"
          loading="lazy"
        />
      </div>
      <img
        src={src}
        alt="Sphère SIERRA"
        width={size}
        height={size}
        className="relative h-full w-full rounded-full object-cover mix-blend-screen animate-float-slow"
        loading="lazy"
      />
    </div>
  );
}
