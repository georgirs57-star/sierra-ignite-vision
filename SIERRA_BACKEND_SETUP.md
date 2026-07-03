# SIERRA — Déploiement Backend Supabase

## 1. Base de données

Ouvre **Supabase Dashboard → SQL Editor** et exécute
`supabase/migrations/0001_sierra_init.sql`.

Crée : `profiles`, `stem_history`, `favorites`, `xp_log`, `chat_history`
+ trigger auto-création profil + trigger auto-incrément XP + RLS complet.

## 2. Authentification

- **Authentication → Providers → Google** : activer, coller Client ID / Secret Google Cloud.
- **URL Configuration** : ajouter l'URL de ton app dans "Redirect URLs".
- Email/Password : activé par défaut.

## 3. Edge Functions

Installe la CLI Supabase, puis :

```bash
supabase login
supabase link --project-ref onimodisuljhrcbyvews

# Ajoute les secrets (une seule fois)
supabase secrets set YOUTUBE_API_KEY=xxx TAVILY_API_KEY=xxx GEMINI_API_KEY=xxx

# Déploie les 3 fonctions
supabase functions deploy stem-feed
supabase functions deploy discover-feed
supabase functions deploy chat-ai
```

## 4. Où obtenir les clés

| Secret            | Où l'obtenir                                                              |
|-------------------|---------------------------------------------------------------------------|
| `YOUTUBE_API_KEY` | Google Cloud Console → API & Services → YouTube Data API v3 → Credentials |
| `TAVILY_API_KEY`  | https://tavily.com (compte gratuit → API Key)                             |
| `GEMINI_API_KEY`  | https://aistudio.google.com/app/apikey                                    |

## 5. Vérification rapide

```bash
curl -X POST https://onimodisuljhrcbyvews.supabase.co/functions/v1/stem-feed \
  -H "Authorization: Bearer <PUBLISHABLE_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Mathématiques","level":"Seconde C"}'
```

Réponse attendue : `{ "shorts": [...], "longs": [...], "feed": [...] }`.
