export interface CampaignInsight {
  campaign_id: string;
  campaign_name: string;
  objective: string;
  status: string;
  daily_budget: number | null;
  lifetime_budget: number | null;
  start_time?: string;
  stop_time?: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  ctr: number;
  cpc: number;
  reach: number;
  frequency: number;
  cpl: number | null;
}

export interface DailyData {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
}

export interface Summary {
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  reach: number;
  ctr: number;
  cpc: number;
  cpl: number | null;
}

export interface GeoBreakdownItem {
  region: string;
  city: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  ctr: number;
  cpl: number | null;
}

export interface DemographicBreakdownItem {
  age: string;
  gender: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  ctr: number;
  cpl: number | null;
}

export interface MetaApiResponse {
  campaigns: CampaignInsight[];
  summary: Summary;
  dailyData: DailyData[];
  geoBreakdown: GeoBreakdownItem[];
  demographicBreakdown: DemographicBreakdownItem[];
  filteredBy: string;
  totalCampaigns: number;
  dateRange: { since: string; until: string } | { preset: string };
  lastUpdated: string;
}

export type DatePreset =
  | "today"
  | "yesterday"
  | "this_week_mon_today"
  | "last_7_days"
  | "last_14_days"
  | "this_month"
  | "last_30_days"
  | "last_month"
  | "last_90_days"
  | "this_year";
