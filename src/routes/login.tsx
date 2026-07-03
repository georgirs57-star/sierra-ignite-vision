import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe, BookOpen, Sparkles, BarChart3, ShieldCheck, Loader2 } from "lucide-react";
import loginArt from "@/assets/login-sierra.png";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — SIERRA" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [lang, setLang] = useState("Français");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const { error } = mode === "signin"
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);
      if (error) throw error;
      navigate({ to: "/home", replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Erreur d'authentification");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setErr(null);
    const { error } = await signInWithGoogle();
    if (error) setErr(error.message);
  };

  return (
    <div className="relative min-h-screen px-5 py-8 sm:px-8">
      <div className="flex justify-end">
        <button
          onClick={() => setLang(lang === "Français" ? "English" : "Français")}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm backdrop-blur"
        >
          <Globe className="h-4 w-4 text-gold" /> {lang}
        </button>
      </div>

      <div className="mx-auto mt-4 grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="card-surface relative hidden overflow-hidden rounded-3xl lg:block">
          <img src={loginArt} alt="" className="h-[640px] w-full object-cover opacity-95" />
          <div className="absolute inset-x-6 bottom-6 text-center">
            <h2 className="text-3xl font-extrabold tracking-[0.25em]">SIERRA</h2>
            <p className="mt-1 text-xs tracking-[0.3em] text-foreground/70">
              TON SAVOIR, <span className="text-gold">TON FUTUR.</span>
            </p>
          </div>
        </div>

        <div className="animate-float-up">
          <h1 className="text-4xl font-extrabold leading-tight">
            {mode === "signin" ? <>Bienvenue<br />sur <span className="text-gold">SIERRA</span></> : <>Créer<br />ton <span className="text-gold">compte</span></>}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {mode === "signin" ? "Connecte-toi pour continuer ton apprentissage." : "Rejoins la communauté SIERRA."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <Field label="Email">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70" />
            </Field>

            <Field label="Mot de passe">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <input type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Au moins 6 caractères"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="text-muted-foreground">
                {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </Field>

            {err && <p className="text-sm text-destructive">{err}</p>}

            <button type="submit" disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-gold-gradient py-4 text-base font-bold text-primary-foreground shadow-gold transition active:scale-[0.98] disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === "signin" ? "Se connecter" : "Créer mon compte")}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OU</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button type="button" onClick={google}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-gold/50 bg-surface/40 py-4 text-sm font-semibold backdrop-blur">
              <GoogleIcon /> Continuer avec Google
            </button>

            <div className="pt-2">
              <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-gold">
                {mode === "signin" ? "Créer un compte" : "J'ai déjà un compte"} <ArrowRight className="h-4 w-4" />
              </button>
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
              <br /><span className="text-gold">SIERRA</span> t'accompagne à chaque étape.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/home" className="underline">Continuer en invité</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/60 px-4 py-3.5 focus-within:border-gold/70">
        {children}
      </div>
    </label>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-surface/60 text-gold">{icon}</div>
      <p>{label}</p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4-5.5 4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.6 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12s4.2 9.3 9.3 9.3c5.4 0 8.9-3.8 8.9-9.1 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}
