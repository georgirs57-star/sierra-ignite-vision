// SIERRA · chat-ai
// Gemini uniquement — assistant pédagogique
// Secret requis : GEMINI_API_KEY
import { corsHeaders, json } from "../_shared/cors.ts";

type Body = { message?: string; level?: string; subject?: string; history?: { role: "user" | "model"; text: string }[] };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const gemini = Deno.env.get("GEMINI_API_KEY");
  if (!gemini) return json({ error: "GEMINI_API_KEY missing" }, 500);

  try {
    const { message = "", level = "Lycée", subject, history = [] } = (await req.json().catch(() => ({}))) as Body;
    if (!message.trim()) return json({ error: "message_required" }, 400);

    const system = `Tu es SIERRA, un professeur virtuel pédagogique pour élèves africains (contexte Burkina Faso).
Adapte tes réponses au niveau : ${level}${subject ? ` — matière : ${subject}` : ""}.
Règles :
- réponds en français simple et structuré
- explique comme un professeur : définitions, exemples concrets locaux, étapes
- pas de liens externes, pas de code markdown fantaisiste
- termine par une astuce ou une mini question de vérification`;

    const contents = [
      { role: "user", parts: [{ text: system }] },
      { role: "model", parts: [{ text: "Compris, je suis prêt à t'aider." }] },
      ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: "user", parts: [{ text: message }] },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gemini}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      },
    );
    if (!res.ok) return json({ error: "gemini_failed", detail: await res.text() }, 502);
    const jsn = await res.json();
    const answer = jsn.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return json({ answer });
  } catch (e) {
    return json({ error: "internal", detail: String(e) }, 500);
  }
});
