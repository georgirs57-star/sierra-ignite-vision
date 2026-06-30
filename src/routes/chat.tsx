import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import emblem from "@/assets/sierra-emblem.jpg";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Assistant SIERRA — Chat" }] }),
  component: ChatPage,
});

type Msg = { id: number; from: "me" | "sierra"; text: string };

const initial: Msg[] = [
  { id: 1, from: "sierra", text: "Salut Aminata ! 👋 Je suis SIERRA, ton assistant d'apprentissage. Pose-moi une question sur n'importe quel sujet." },
  { id: 2, from: "me", text: "Peux-tu m'expliquer le théorème de Pythagore ?" },
  { id: 3, from: "sierra", text: "Bien sûr ! Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés. Si a et b sont les côtés et c l'hypoténuse : a² + b² = c²." },
];

const suggestions = [
  "Explique-moi la photosynthèse",
  "Résume la Première Guerre mondiale",
  "Comment résoudre une équation du 2nd degré ?",
];

const history = [
  "Théorème de Pythagore",
  "Photosynthèse expliquée",
  "Révolution française 1789",
  "Équations différentielles",
];

function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const id = Date.now();
    setMsgs((m) => [...m, { id, from: "me", text: content }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: id + 1,
          from: "sierra",
          text: "Excellente question ! Voici une réponse claire et structurée pour t'aider à mieux comprendre ce concept. (Réponse simulée — l'IA sera connectée prochainement.)",
        },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-7rem)] flex-col px-5 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gold/30 blur-xl" />
            <img src={emblem} alt="" className="relative h-12 w-12 rounded-full object-cover mix-blend-screen" width={100} height={100} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Assistant SIERRA</h1>
            <p className="text-xs text-emerald-400">● En ligne</p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface/60">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* History chips */}
        <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {history.map((h) => (
            <button key={h} className="whitespace-nowrap rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-foreground/80">
              {h}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="mt-4 flex-1 space-y-3 overflow-y-auto pb-4">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              {m.from === "sierra" && (
                <img src={emblem} alt="" className="mr-2 h-8 w-8 shrink-0 rounded-full object-cover mix-blend-screen" />
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed animate-float-up ${
                  m.from === "me"
                    ? "rounded-br-md bg-gold-gradient text-primary-foreground shadow-gold"
                    : "card-surface rounded-bl-md"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-2">
              <img src={emblem} alt="" className="h-8 w-8 rounded-full object-cover mix-blend-screen" />
              <div className="card-surface flex gap-1 rounded-2xl rounded-bl-md px-4 py-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-gold [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-gold [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {msgs.length <= 3 && (
          <div className="mb-3 space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-gold/40 bg-surface/60 px-3 py-1.5 text-xs text-foreground/90"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2 rounded-full border border-border bg-surface/80 p-1.5 backdrop-blur focus-within:border-gold/70"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pose ta question à SIERRA..."
            className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/70"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-primary-foreground shadow-gold disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
