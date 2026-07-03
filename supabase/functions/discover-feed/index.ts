// SIERRA · discover-feed
// Tavily (recherche web) → Gemini (transformation pédagogique)
// Secrets requis : TAVILY_API_KEY, GEMINI_API_KEY
import { corsHeaders, json } from "../_shared/cors.ts";

type Body = { query?: string; subject?: string; level?: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const tavily = Deno.env.get("TAVILY_API_KEY");
  const gemini = Deno.env.get("GEMINI_API_KEY");
  if (!tavily || !gemini) return json({ error: "missing_api_keys" }, 500);

  try {
    const { query = "", subject = "Général", level = "Lycée" } = (await req.json().catch(() => ({}))) as Body;
    if (!query.trim()) return json({ error: "query_required" }, 400);

    // 1) Tavily
    const tres = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavily,
        query: `${subject} — ${query}`,
        search_depth: "advanced",
        include_answer: true,
        max_results: 6,
        topic: "general",
      }),
    });
    if (!tres.ok) return json({ error: "tavily_failed", detail: await tres.text() }, 502);
    const tjson = await tres.json();
    const context = (tjson.results ?? [])
      .map((r: any) => `Source: ${r.title}\nURL: ${r.url}\n${r.content}`)
      .join("\n\n---\n\n");
    const sources = (tjson.results ?? []).map((r: any) => ({ title: r.title, url: r.url }));

    // 2) Gemini transforme en réponse pédagogique
    const prompt = `Tu es un professeur pédagogue africain. Transforme les sources ci-dessous en une explication éducative claire pour un(e) élève de ${level} en ${subject}, dans un français simple et structuré.

Structure :
1. Réponse courte (2-3 phrases)
2. Explication détaillée avec exemples adaptés à l'Afrique de l'Ouest
3. Points clés à retenir (liste)
4. Une question pour tester la compréhension

QUESTION : ${query}

SOURCES :
${context}`;

    const gres = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gemini}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      },
    );
    if (!gres.ok) return json({ error: "gemini_failed", detail: await gres.text() }, 502);
    const gjson = await gres.json();
    const answer = gjson.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return json({ answer, sources });
  } catch (e) {
    return json({ error: "internal", detail: String(e) }, 500);
  }
});
