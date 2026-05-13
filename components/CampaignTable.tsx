"use client";

import { CampaignInsight } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent, formatDate, statusLabel } from "@/lib/utils";
import { useState } from "react";

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
    color: sortKey === key ? "var(--accent)" : "var(--text-muted)",
    fontFamily: "var(--font-body)",
    whiteSpace: "nowrap" as const,
    userSelect: "none" as const,
    borderBottom: "1px solid var(--border)",
  });

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
              color: statusFilter === s ? "var(--accent)" : "var(--text-secondary)",
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
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr>
                <th style={colStyle("campaign_name")} onClick={() => handleSort("campaign_name")}>
                  Campagna {sortKey === "campaign_name" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={colStyle("status")} onClick={() => handleSort("status")}>
                  Stato
                </th>
                <th style={colStyle("objective")} onClick={() => handleSort("objective")}>
                  Obiettivo
                </th>
                <th style={{ ...colStyle("spend"), textAlign: "right" }} onClick={() => handleSort("spend")}>
                  Spesa {sortKey === "spend" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={{ ...colStyle("impressions"), textAlign: "right" }} onClick={() => handleSort("impressions")}>
                  Impression {sortKey === "impressions" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={{ ...colStyle("clicks"), textAlign: "right" }} onClick={() => handleSort("clicks")}>
                  Click {sortKey === "clicks" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={{ ...colStyle("ctr"), textAlign: "right" }} onClick={() => handleSort("ctr")}>
                  CTR {sortKey === "ctr" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={{ ...colStyle("leads"), textAlign: "right" }} onClick={() => handleSort("leads")}>
                  Lead {sortKey === "leads" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={{ ...colStyle("cpl"), textAlign: "right" }} onClick={() => handleSort("cpl")}>
                  CPL {sortKey === "cpl" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th style={colStyle("stop_time")}>Scadenza</th>
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
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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
