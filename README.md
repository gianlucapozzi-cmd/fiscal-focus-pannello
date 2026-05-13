# Meta Ads Dashboard

Dashboard per il monitoraggio delle campagne Meta Ads, con filtro automatico per keyword (es. "Meraviglia").

---

## 🚀 Setup rapido

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura le variabili d'ambiente

Copia il file `.env.example` in `.env.local`:

```bash
cp .env.example .env.local
```

Poi apri `.env.local` e inserisci:

```
META_ACCESS_TOKEN=il_tuo_long_lived_token
META_AD_ACCOUNT_ID=act_116713878687435
CAMPAIGN_FILTER_KEYWORD=Meraviglia
API_SECRET=qualsiasi_stringa_random_lunga
NEXT_PUBLIC_API_SECRET=stessa_stringa_di_sopra
```

**Importante:** Next.js legge solo `.env`, `.env.local`, ecc. **Non** mettere mai token o secret in `.gitignore` (è solo per Git: l’app non le carica). Dopo ogni modifica alle env, riavvia `npm run dev`. `API_SECRET` e `NEXT_PUBLIC_API_SECRET` devono essere identici, altrimenti vedrai `401 Unauthorized` sulle chiamate a `/api/meta`.

### 3. Ottieni il Long-Lived Token Meta

Il token che usi in n8n scade ogni 60 giorni. Puoi rinnovarlo con:

```
https://graph.facebook.com/v22.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={APP_ID}
  &client_secret={APP_SECRET}
  &fb_exchange_token={TOKEN_ATTUALE}
```

Oppure usa il [Token Debugger di Meta](https://developers.facebook.com/tools/debug/accesstoken/).

### 4. Avvia in locale

```bash
npm run dev
```

Vai su `http://localhost:3000`

---

## 📦 Deploy su Vercel

### Opzione A: Da Cursor / CLI

```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
vercel

# Segui le istruzioni e poi aggiungi le env vars:
vercel env add META_ACCESS_TOKEN
vercel env add META_AD_ACCOUNT_ID
vercel env add CAMPAIGN_FILTER_KEYWORD
vercel env add API_SECRET
vercel env add NEXT_PUBLIC_API_SECRET

# Deploy finale
vercel --prod
```

### Opzione B: Da GitHub (consigliato)

1. Crea un repo su GitHub e carica il progetto
2. Vai su [vercel.com](https://vercel.com), collega il repo
3. Nella sezione **Environment Variables** del progetto Vercel, aggiungi tutte le variabili
4. Clicca **Deploy**

---

## 🔧 Struttura del progetto

```
meta-dashboard/
├── app/
│   ├── api/meta/route.ts   ← API che chiama Meta Graph API
│   ├── page.tsx            ← Dashboard principale
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── KpiCard.tsx         ← Card KPI (spesa, click, lead...)
│   ├── DateFilter.tsx      ← Filtro periodo
│   ├── CampaignTable.tsx   ← Tabella campagne con sort/filter
│   └── SpendChart.tsx      ← Grafico andamento (area/barre)
├── lib/
│   ├── types.ts            ← TypeScript interfaces
│   └── utils.ts            ← Formattatori (€, %, date...)
└── .env.example
```

---

## 🎯 Come funziona il filtro "Meraviglia"

La variabile `CAMPAIGN_FILTER_KEYWORD` fa sì che la dashboard mostri **solo le campagne il cui nome contiene quella parola**.

Se hai `CAMPAIGN_FILTER_KEYWORD=Meraviglia`, verranno mostrate solo campagne tipo:
- "Meraviglia - Lead Gen Aprile"
- "[Meraviglia] Awareness 2025"

Le campagne del cliente non chiamate "Meraviglia" vengono escluse automaticamente.

**Per cambiare keyword**: modifica la variabile su Vercel e fai un nuovo deploy (o ri-deploy automatico se usi GitHub).

---

## 📊 KPI mostrate

| Metrica | Descrizione |
|---------|-------------|
| Spesa | Totale speso nel periodo |
| Impression | Quante volte gli annunci sono stati visti |
| Click | Click sugli annunci |
| CTR | Click-through rate (click / impression × 100) |
| Lead | Conversioni di tipo lead |
| CPL | Costo per lead (spesa / lead) |
| CPC | Costo per click |
| Reach | Persone uniche raggiunte |
| Frequency | Media impression per persona |

---

## ⚠️ Note importanti

- **Token Meta**: scade ogni 60 giorni. Aggiorna `META_ACCESS_TOKEN` su Vercel quando scade.
- **Rate limit**: l'API Meta ha limiti di chiamate. La dashboard usa cache di 5 minuti (`revalidate: 300`) per non esaurire il rate limit.
- **Permessi token**: il token deve avere i permessi `ads_read` e `read_insights`.
