import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.META_ACCESS_TOKEN!;
const ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID!; // es: act_116713878687435
const FILTER_KEYWORD = process.env.CAMPAIGN_FILTER_KEYWORD || "Meraviglia";
const API_SECRET = process.env.API_SECRET;

// Mappa obiettivi Meta → leggibile
const objectiveMap: Record<string, string> = {
  OUTCOME_LEADS: "Lead Generation",
  OUTCOME_SALES: "Vendite",
  OUTCOME_TRAFFIC: "Traffico",
  OUTCOME_ENGAGEMENT: "Engagement",
  OUTCOME_AWARENESS: "Brand Awareness",
  OUTCOME_APP_PROMOTION: "Promozione App",
  LEAD_GENERATION: "Lead Generation",
  CONVERSIONS: "Conversioni",
  LINK_CLICKS: "Traffico",
  BRAND_AWARENESS: "Brand Awareness",
  REACH: "Copertura",
  VIDEO_VIEWS: "Video Views",
  MESSAGES: "Messaggi",
};

async function fetchMeta(path: string, params: Record<string, string> = {}) {
  const url = new URL(`https://graph.facebook.com/v22.0/${path}`);
  url.searchParams.set("access_token", TOKEN);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 300 } }); // cache 5 min
  if (!res.ok) throw new Error(`Meta API error: ${res.status} on ${path}`);
  return res.json();
}

export async function GET(req: NextRequest) {
  // Protezione base con secret header
  const secret = req.headers.get("x-api-secret");
  if (API_SECRET && API_SECRET.length > 0 && secret !== API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const datePreset = searchParams.get("date_preset") || "this_month";
  // oppure range custom
  const since = searchParams.get("since"); // YYYY-MM-DD
  const until = searchParams.get("until"); // YYYY-MM-DD

  try {
    // 1. Fetch campagne dell'account
    const campaignsData = await fetchMeta(`${ACCOUNT_ID}/campaigns`, {
      fields: "id,name,objective,status,daily_budget,lifetime_budget,start_time,stop_time",
      limit: "100",
    });

    const allCampaigns: Campaign[] = campaignsData.data || [];

    // 2. Filtra per parola chiave "Meraviglia"
    const campaigns = allCampaigns.filter((c: Campaign) =>
      c.name.toLowerCase().includes(FILTER_KEYWORD.toLowerCase())
    );

    if (campaigns.length === 0) {
      return NextResponse.json({
        campaigns: [],
        insights: [],
        summary: { spend: 0, impressions: 0, clicks: 0, leads: 0, ctr: 0, cpc: 0 },
        filteredBy: FILTER_KEYWORD,
        totalCampaigns: allCampaigns.length,
      });
    }

    // 3. Fetch insights per ogni campagna
    const insightRequests = campaigns.map(async (campaign: Campaign) => {
      try {
        const insightParams: Record<string, string> = {
          fields: "impressions,clicks,spend,actions,ctr,cpc,reach,frequency",
        };
        if (since && until) {
          insightParams.time_range = JSON.stringify({ since, until });
        } else {
          insightParams.date_preset = datePreset;
        }

        const insights = await fetchMeta(`${campaign.id}/insights`, insightParams);

        const data = insights.data?.[0] || {};
        const leads = data.actions?.find(
          (a: Action) => a.action_type === "lead" || a.action_type === "onsite_conversion.lead_grouped"
        )?.value || "0";

        return {
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          objective: objectiveMap[campaign.objective] || campaign.objective,
          status: campaign.status,
          daily_budget: campaign.daily_budget
            ? parseFloat(campaign.daily_budget) / 100
            : null,
          lifetime_budget: campaign.lifetime_budget
            ? parseFloat(campaign.lifetime_budget) / 100
            : null,
          start_time: campaign.start_time,
          stop_time: campaign.stop_time,
          // Insights
          spend: parseFloat(data.spend || "0"),
          impressions: parseInt(data.impressions || "0"),
          clicks: parseInt(data.clicks || "0"),
          leads: parseInt(leads),
          ctr: parseFloat(data.ctr || "0"),
          cpc: parseFloat(data.cpc || "0"),
          reach: parseInt(data.reach || "0"),
          frequency: parseFloat(data.frequency || "0"),
          cpl: parseFloat(leads) > 0
            ? parseFloat(data.spend || "0") / parseFloat(leads)
            : null,
        };
      } catch {
        return {
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          objective: objectiveMap[campaign.objective] || campaign.objective,
          status: campaign.status,
          daily_budget: campaign.daily_budget ? parseFloat(campaign.daily_budget) / 100 : null,
          lifetime_budget: campaign.lifetime_budget ? parseFloat(campaign.lifetime_budget) / 100 : null,
          start_time: campaign.start_time,
          stop_time: campaign.stop_time,
          spend: 0, impressions: 0, clicks: 0, leads: 0,
          ctr: 0, cpc: 0, reach: 0, frequency: 0, cpl: null,
        };
      }
    });

    const insightsResults = await Promise.all(insightRequests);

    // 4. Summary totale
    const summary = insightsResults.reduce(
      (acc, c) => ({
        spend: acc.spend + c.spend,
        impressions: acc.impressions + c.impressions,
        clicks: acc.clicks + c.clicks,
        leads: acc.leads + c.leads,
        reach: acc.reach + (c.reach || 0),
      }),
      { spend: 0, impressions: 0, clicks: 0, leads: 0, reach: 0 }
    );

    const summaryWithRates = {
      ...summary,
      ctr: summary.impressions > 0 ? (summary.clicks / summary.impressions) * 100 : 0,
      cpc: summary.clicks > 0 ? summary.spend / summary.clicks : 0,
      cpl: summary.leads > 0 ? summary.spend / summary.leads : null,
    };

    // 5. Dati storici per grafico (ultimi 30 giorni per default)
    let dailyData: DailyInsight[] = [];
    try {
      const historicalInsights = await fetchMeta(`${ACCOUNT_ID}/insights`, {
        fields: "spend,impressions,clicks,actions",
        date_preset: "last_30_days",
        time_increment: "1",
        filtering: JSON.stringify([
          {
            field: "campaign.name",
            operator: "CONTAIN",
            value: FILTER_KEYWORD,
          },
        ]),
      });
      dailyData = (historicalInsights.data || []).map((d: RawDailyInsight) => ({
        date: d.date_start,
        spend: parseFloat(d.spend || "0"),
        impressions: parseInt(d.impressions || "0"),
        clicks: parseInt(d.clicks || "0"),
        leads: parseInt(
          d.actions?.find(
            (a: Action) => a.action_type === "lead" || a.action_type === "onsite_conversion.lead_grouped"
          )?.value || "0"
        ),
      }));
    } catch {
      // Fallback silenzioso se il filtering non funziona
    }

    return NextResponse.json({
      campaigns: insightsResults,
      summary: summaryWithRates,
      dailyData,
      filteredBy: FILTER_KEYWORD,
      totalCampaigns: allCampaigns.length,
      dateRange: since && until ? { since, until } : { preset: datePreset },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Meta API error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dati Meta", detail: String(error) },
      { status: 500 }
    );
  }
}

// Types
interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
}

interface Action {
  action_type: string;
  value: string;
}

interface DailyInsight {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
}

interface RawDailyInsight {
  date_start: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  actions?: Action[];
}
