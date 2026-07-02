"use client";

import { CampaignInsight } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent, formatDate } from "@/lib/utils";
import { useState } from "react";
import { MetricHint } from "@/components/MetricHint";
import { METRIC_HELP } from "@/lib/metricHelp";

interface CampaignTableProps {
  campaigns: CampaignInsight[];
}

type SortKey = keyof CampaignInsight;

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = campaigns.filter(
    (c) => statusFilter === "ALL" || c.status === statusFilter
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey] ?? 0;
    const bVal = b[sortKey] ?? 0;
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const statusCounts = {
    ALL: campaigns.length,
    ACTIVE: campaigns.filter((c) => c.status === "ACTIVE").length,
    PAUSED: campaigns.filter((c) => c.status === "PAUSED").length,
  };

  const colStyle = (key: SortKey) => ({
    cursor: "pointer",
    padding: "12px 16px",
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: sortKey === key ? "var(--accent)" : "var(--text-secondary)",
    fontFamily: "var(--font-body)",
    whiteSpace: "nowrap" as const,
    userSelect: "none" as const,
    borderBottom: "1px solid var(--border)",
  });

  const SortTh = ({
    label,
    columnKey,
    help,
    alignRight,
  }: {
    label: string;
    columnKey: SortKey;
    help: string;
    alignRight?: boolean;
  }) => (
    <th
      style={{
        ...colStyle(columnKey),
        ...(alignRight ? { textAlign: "right" as const } : {}),
      }}
      onClick={() => handleSort(columnKey)}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: alignRight ? "flex-end" : "flex-start",
          gap: "6px",
          width: "100%",
        }}
      >
        <span>
          {label}
          {sortKey === columnKey ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
        </span>
        <span onClick={(e) => e.stopPropagation()}>
          <MetricHint text={help} />
        </span>
      </div>
    </th>
  );

  const StaticTh = ({
    label,
    help,
    columnKey,
  }: {
    label: string;
    help: string;
    columnKey: SortKey;
  }) => (
    <th style={{ ...colStyle(columnKey), cursor: "default" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <span>{label}</span>
        <MetricHint text={help} />
      </div>
    </th>
  );

  return (
    <div>
      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {(["ALL", "ACTIVE", "PAUSED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: statusFilter === s ? "var(--accent)" : "var(--border)",
              background: statusFilter === s ? "var(--accent-soft)" : "transparent",
              color: statusFilter === s ? "var(--accent)" : "var(--text-primary)",
              fontSize: "12px",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {s === "ACTIVE" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />}
            {s === "PAUSED" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yellow)", display: "inline-block" }} />}
            {s === "ALL" ? "Tutte" : s === "ACTIVE" ? "Attive" : "In pausa"}
            <span style={{ opacity: 0.6 }}>({statusCounts[s]})</span>
          </button>
        ))}
      </div>

      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr>
                <SortTh label="Campagna" columnKey="campaign_name" help={METRIC_HELP.campaign_name} />
                <SortTh label="Stato" columnKey="status" help={METRIC_HELP.status} />
                <SortTh label="Obiettivo" columnKey="objective" help={METRIC_HELP.objective} />
                <SortTh label="Spesa" columnKey="spend" help={METRIC_HELP.spend} alignRight />
                <SortTh label="Impression" columnKey="impressions" help={METRIC_HELP.impressions} alignRight />
                <SortTh label="Click" columnKey="clicks" help={METRIC_HELP.clicks} alignRight />
                <SortTh label="CTR" columnKey="ctr" help={METRIC_HELP.ctr} alignRight />
                <SortTh label="Lead" columnKey="leads" help={METRIC_HELP.leads} alignRight />
                <SortTh label="CPL" columnKey="cpl" help={METRIC_HELP.cpl} alignRight />
                <StaticTh label="Scadenza" columnKey="stop_time" help={METRIC_HELP.stop_time} />
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "13px" }}>
                    Nessuna campagna trovata
                  </td>
                </tr>
              )}
              {sorted.map((c, i) => (
                <tr
                  key={c.campaign_id}
                  style={{
                    borderTop: "1px solid var(--border)",
                    transition: "background 0.15s",
                    background: i % 2 === 0 ? "transparent" : "rgba(79, 70, 229, 0.02)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(79, 70, 229, 0.02)")}
                >
                  <td style={{ padding: "14px 16px", maxWidth: "240px" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "var(--font-body)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.campaign_name}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <StatusBadge status={c.status} />
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                      {c.objective}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontFamily: "var(--font-body)", color: "var(--text-primary)", fontWeight: 500 }}>
                    {formatCurrency(c.spend)}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    {formatNumber(c.impressions)}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    {formatNumber(c.clicks)}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontFamily: "var(--font-body)", color: c.ctr > 1 ? "var(--green)" : "var(--text-secondary)" }}>
                    {formatPercent(c.ctr)}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "14px", fontFamily: "var(--font-body)", fontWeight: 600, color: c.leads > 0 ? "var(--accent)" : "var(--text-muted)" }}>
                    {c.leads > 0 ? c.leads : "—"}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    {c.cpl ? formatCurrency(c.cpl) : "—"}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
                    {formatDate(c.stop_time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bg: string; color: string; dot: string }> = {
    ACTIVE: { label: "Attiva", bg: "var(--green-soft)", color: "var(--green)", dot: "var(--green)" },
    PAUSED: { label: "In pausa", bg: "var(--yellow-soft)", color: "var(--yellow)", dot: "var(--yellow)" },
    ARCHIVED: { label: "Archiviata", bg: "rgba(255,255,255,0.05)", color: "var(--text-muted)", dot: "var(--text-muted)" },
    DELETED: { label: "Eliminata", bg: "var(--red-soft)", color: "var(--red)", dot: "var(--red)" },
  };
  const c = config[status] || config.ARCHIVED;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 10px", borderRadius: "20px",
      background: c.bg, color: c.color,
      fontSize: "11px", fontFamily: "var(--font-body)",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {c.label}
    </span>
  );
}
