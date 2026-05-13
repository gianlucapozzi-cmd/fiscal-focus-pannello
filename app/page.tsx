"use client";

import { useState, useEffect, useCallback } from "react";
import { MetaApiResponse, DatePreset } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { KpiCard } from "@/components/KpiCard";
import { DateFilter } from "@/components/DateFilter";
import { CampaignTable } from "@/components/CampaignTable";
import { SpendChart } from "@/components/SpendChart";
import {
  TrendingUp, MousePointer, Eye, Users,
  RefreshCw, Zap, DollarSign, Target
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<MetaApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [datePreset, setDatePreset] = useState<DatePreset>("this_month");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async (preset: DatePreset) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/meta?date_preset=${preset}`, {
        headers: {
          "x-api-secret": process.env.NEXT_PUBLIC_API_SECRET || "",
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(datePreset);
  }, [datePreset, fetchData]);

  const activeCampaigns = data?.campaigns.filter((c) => c.status === "ACTIVE").length ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "0 0 60px" }}>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(20px)",
        zIndex: 100,
        gap: "16px",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "32px", height: "32px",
            background: "var(--accent)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={16} color="#fff" />
          </div>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}>
              Meta Ads
            </h1>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: "2px" }}>
              {data ? (
                <>
                  Campagne "{data.filteredBy}" · {data.campaigns.length} su {data.totalCampaigns} totali
                </>
              ) : "Caricamento..."}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {lastRefresh && (
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Aggiornato {lastRefresh.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={() => fetchData(datePreset)}
            disabled={loading}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "12px", fontFamily: "var(--font-body)",
              opacity: loading ? 0.5 : 1,
              transition: "all 0.15s",
            }}
          >
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            Aggiorna
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 32px 0" }}>

        {/* Date filter */}
        <div style={{ marginBottom: "28px" }}>
          <DateFilter selected={datePreset} onChange={setDatePreset} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "16px 20px",
            background: "var(--red-soft)",
            border: "1px solid var(--red)",
            borderRadius: "10px",
            marginBottom: "24px",
            color: "var(--red)",
            fontSize: "13px",
            fontFamily: "var(--font-body)",
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                height: "120px",
                background: "var(--bg-card)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* KPI Grid */}
        {!loading && data && (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "28px",
            }}>
              <KpiCard
                label="Spesa totale"
                value={formatCurrency(data.summary.spend)}
                icon={<DollarSign size={18} />}
                accentColor="var(--accent)"
              />
              <KpiCard
                label="Impression"
                value={formatNumber(data.summary.impressions)}
                icon={<Eye size={18} />}
                accentColor="var(--green)"
              />
              <KpiCard
                label="Click"
                value={formatNumber(data.summary.clicks)}
                icon={<MousePointer size={18} />}
                accentColor="var(--yellow)"
              />
              <KpiCard
                label="CTR medio"
                value={formatPercent(data.summary.ctr)}
                sub={data.summary.ctr > 1 ? "Ottimo" : data.summary.ctr > 0.5 ? "Nella media" : "Da migliorare"}
                icon={<TrendingUp size={18} />}
                accentColor={data.summary.ctr > 1 ? "var(--green)" : "var(--yellow)"}
              />
              <KpiCard
                label="Lead"
                value={String(data.summary.leads)}
                sub={data.summary.cpl ? `CPL: ${formatCurrency(data.summary.cpl)}` : undefined}
                icon={<Target size={18} />}
                accentColor="#ec4899"
              />
              <KpiCard
                label="Campagne attive"
                value={String(activeCampaigns)}
                sub={`${data.campaigns.length} campagne totali`}
                icon={<Users size={18} />}
                accentColor="var(--accent)"
              />
            </div>

            {/* Chart */}
            {data.dailyData.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <SpendChart data={data.dailyData} />
              </div>
            )}

            {/* Campaign Table */}
            <div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "16px",
                letterSpacing: "-0.01em",
              }}>
                Dettaglio campagne
                <span style={{ marginLeft: "8px", fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 400 }}>
                  · {data.campaigns.length} campagne "{data.filteredBy}"
                </span>
              </h2>
              <CampaignTable campaigns={data.campaigns} />
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && data && data.campaigns.length === 0 && (
          <div style={{
            padding: "60px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
            Nessuna campagna con nome "{data.filteredBy}" trovata sull'account
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
