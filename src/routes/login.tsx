import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe, BookOpen, Sparkles, BarChart3, ShieldCheck } from "lucide-react";
import loginArt from "@/assets/login-sierra.png";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — SIERRA" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [lang, setLang] = useState("Français");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/home", replace: true });
  };

  return (
    <div className="relative min-h-screen px-5 py-8 sm:px-8">
      {/* Lang selector */}
      <div className="flex justify-end">
        <button
          onClick={() => setLang(lang === "Français" ? "English" : "Français")}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm backdrop-blur"
        >
          <Globe className="h-4 w-4 text-gold" />
          {lang}
        </button>
      </div>

      <div className="mx-auto mt-4 grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
        {/* Visual side */}
        <div className="card-surface relative hidden overflow-hidden rounded-3xl lg:block">
          <img src={loginArt} alt="" className="h-[640px] w-full object-cover opacity-95" width={800} height={1400} />
          <div className="absolute inset-x-6 bottom-6 text-center">
            <h2 className="text-3xl font-extrabold tracking-[0.25em] text-foreground">SIERRA</h2>
            <p className="mt-1 text-xs tracking-[0.3em] text-foreground/70">
              TON SAVOIR, <span className="text-gold">TON FUTUR.</span>
            </p>
          </div>
        </div>

        {/* Form side */}
        <div className="animate-float-up">
          <h1 className="text-4xl font-extrabold leading-tight">
            Bienvenue
            <br />
            sur <span className="text-gold">SIERRA</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Connecte-toi pour continuer ton apprentissage.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <Field label="Email ou numéro de téléphone">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="exemple@email.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </Field>

            <Field label="Mot de passe">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <input
                type={showPw ? "text" : "password"}
                placeholder="Entrez votre mot de passe"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="text-muted-foreground">
                {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </Field>

            <div className="text-right">
              <button type="button" className="text-sm font-semibold text-gold hover:underline">
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-gold-gradient py-4 text-base font-bold text-primary-foreground shadow-gold transition-transform active:scale-[0.98]"
            >
              Se connecter
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-foreground/15 transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OU</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={() => navigate({ to: "/home" })}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-gold/50 bg-surface/40 py-4 text-sm font-semibold backdrop-blur"
            >
              <GoogleIcon /> Continuer avec Google
            </button>

            <div className="pt-2">
              <p className="text-sm text-foreground/80">Pas encore de compte ?</p>
              <Link to="/home" className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-gold">
                Créer un compte <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </form>

          <div className="mt-10 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <Feature icon={<BookOpen className="h-5 w-5" />} label="Apprentissage intelligent" />
            <Feature icon={<Sparkles className="h-5 w-5" />} label="Contenu de qualité" />
            <Feature icon={<BarChart3 className="h-5 w-5" />} label="Progression personnalisée" />
          </div>

          <div className="card-surface mt-6 flex items-start gap-4 rounded-2xl p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-sm leading-relaxed">
              Apprends. Explore. Progresse. Réussis.
              <br />
              <span className="text-gold">SIERRA</span> t'accompagne à chaque étape.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3.5 backdrop-blur focus-within:border-gold/70 focus-within:ring-2 focus-within:ring-ring/40">
        {children}
      </div>
    </label>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-gold/30 bg-surface/60 text-gold">
        {icon}
      </div>
      <span className="leading-tight">{label}</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.5-.2-3-.4-4.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5c-7.6 0-14.2 4.3-17.7 10.2z"/>
      <path fill="#4CAF50" d="M24 45.5c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.4-4.6 2.3-7.3 2.3-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.8 41.1 16.3 45.5 24 45.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.3l6.2 5.2C41.8 35 44.5 30 44.5 25c0-1.5-.2-3-.9-4.5z"/>
    </svg>
  );
}
