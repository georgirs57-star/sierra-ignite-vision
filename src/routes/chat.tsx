import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Plus, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SierraSphere, useIsDay } from "@/components/SierraSphere";
import { supabase, invokeEdgeFunction } from "@/lib/supabase";
import { useAuth, logXp } from "@/hooks/useAuth";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Assistant SIERRA — Chat" }] }),
  component: ChatPage,
});

type Msg = { id: string; from: "me" | "sierra"; text: string };

const suggestions = [
  "Explique-moi la photosynthèse",
  "Résume la Première Guerre mondiale",
  "Comment résoudre une équation du 2nd degré ?",
];

function ChatPage() {
  const { user, profile } = useAuth();
  const isDay = useIsDay();
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "welcome", from: "sierra", text: "Salut ! 👋 Je suis SIERRA, ton assistant d'apprentissage. Pose-moi une question sur n'importe quel sujet." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("chat_history")
      .select("id,message,response,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(20)
      .then(({ data }) => {
        if (!data?.length) return;
        const list: Msg[] = [];
        for (const r of data as any[]) {
          list.push({ id: `u-${r.id}`, from: "me", text: r.message });
          if (r.response) list.push({ id: `a-${r.id}`, from: "sierra", text: r.response });
        }
        setMsgs((prev) => [prev[0], ...list]);
      });
  }, [user?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const id = String(Date.now());
    setMsgs((m) => [...m, { id, from: "me", text: content }]);
    setInput("");
    setTyping(true);

    try {
      const history = msgs.slice(-8).map((m) => ({
        role: m.from === "me" ? "user" as const : "model" as const,
        text: m.text,
      }));
      const res = await invokeEdgeFunction<{ answer: string }>("chat-ai", {
        message: content,
        level: profile?.level ?? "Seconde C",
        history,
      });
      const answer = res.answer || "…";
      setMsgs((m) => [...m, { id: id + "-a", from: "sierra", text: answer }]);
      if (user) {
        void supabase.from("chat_history").insert({ user_id: user.id, message: content, response: answer });
        void logXp(user.id, "chat_question", 3);
      }
    } catch (e) {
      setMsgs((m) => [...m, { id: id + "-a", from: "sierra", text: `Désolé, une erreur est survenue : ${e instanceof Error ? e.message : "inconnue"}` }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-7rem)] flex-col px-5 pt-6">
        <div className="flex items-center gap-3">
          <SierraSphere size={52} />
          <div className="flex-1">
            <h1 className="text-xl font-bold">Assistant SIERRA</h1>
            <p className="text-xs text-emerald-400">
              ● En ligne — {isDay ? "Mode Jour ☀" : "Mode Nuit ☾"}
            </p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface/60">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="mt-4 flex-1 space-y-3 overflow-y-auto pb-4">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              {m.from === "sierra" && <div className="mr-2 shrink-0"><SierraSphere size={32} /></div>}
              <div
                className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
              <SierraSphere size={32} />
              <div className="card-surface flex items-center gap-2 rounded-2xl rounded-bl-md px-4 py-3 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" /> SIERRA réfléchit…
              </div>
            </div>
          )}
        </div>

        {msgs.length <= 2 && (
          <div className="mb-3 space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-gold/40 bg-surface/60 px-3 py-1.5 text-xs">{s}</button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); void send(); }}
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
            disabled={!input.trim() || typing}
            className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-primary-foreground shadow-gold disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
