/**
 * Testi di aiuto per le metriche (dati Meta Ads / insights).
 * Usati da KPI, tabella campagne e grafico.
 */
export const METRIC_HELP = {
  spend_total:
    "Importo totale speso in pubblicità nel periodo selezionato, sommando le campagne filtrate. È il dato fatturato da Meta sull’account.",
  impressions:
    "Quante volte le inserzioni sono state mostrate. Una stessa persona può generare più impression se vede l’annuncio più volte.",
  clicks:
    "Numero di clic sulle inserzioni o sui link tracciati dall’annuncio, nel periodo scelto.",
  ctr:
    "Click-through rate: rapporto tra click e impression (in percentuale). Misura quanto l’annuncio è rilevante e invoglia a cliccare.",
  leads:
    "Contatti o azioni di tipo lead attribuite alle campagne (es. invio modulo, lead da instant form), come le contabilizza Meta nel periodo. Sotto, se presente, compare il CPL (spesa ÷ lead).",
  cpl:
    "Costo per lead: spesa divisa per il numero di lead. Indica quanto costa in media acquisire un contatto nel periodo.",
  cpc:
    "Costo per click: spesa divisa per i click. Utile per confrontare l’efficienza del traffico tra campagne o periodi.",
  reach:
    "Stima delle persone uniche che hanno visto almeno una volta le inserzioni (non è la somma delle impression).",
  frequency:
    "Media di quante volte la stessa persona ha visto le inserzioni nel periodo (impression ÷ reach approssimativo).",
  active_campaigns:
    "Campagne con stato “Attiva” tra quelle il cui nome contiene il filtro configurato (es. parola chiave nel nome).",
  campaign_name:
    "Nome della campagna così come è salvato in Meta. Il pannello mostra solo le campagne il cui nome contiene il filtro impostato.",
  status:
    "Stato operativo in Meta: in delivery (Attiva), in pausa, archiviata, ecc.",
  objective:
    "Obiettivo di ottimizzazione scelto in Meta per la campagna (es. lead, traffico, vendite).",
  spend:
    "Budget speso da quella campagna nel periodo selezionato.",
  stop_time:
    "Data di fine pianificata o di stop della campagna, se indicata da Meta (può essere vuota se aperta / senza scadenza).",
  chart_spend:
    "Andamento giornaliero della spesa: quanto è stato speso ogni giorno nel periodo del grafico.",
  chart_impressions:
    "Andamento giornaliero delle impression: quante visualizzazioni sono state registrate ogni giorno.",
  chart_clicks:
    "Andamento giornaliero dei clic sulle inserzioni per giorno.",
  chart_leads:
    "Andamento giornaliero dei lead attribuiti alle inserzioni filtrate, per giorno.",
} as const;

export type MetricHelpKey = keyof typeof METRIC_HELP;
