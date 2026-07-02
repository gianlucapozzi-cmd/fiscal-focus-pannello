"use client";

import { DemographicBreakdownItem, GeoBreakdownItem } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

interface AudienceBreakdownsProps {
  geoData: GeoBreakdownItem[];
  demographicData: DemographicBreakdownItem[];
}

function cellStyle(align: "left" | "right" = "left") {
  return {
    padding: "10px 12px",
    fontSize: "12px",
    color: "var(--text-secondary)",
    fontFamily: "var(--font-body)",
    textAlign: align,
    borderTop: "1px solid var(--border)",
    whiteSpace: "nowrap" as const,
  };
}

export function AudienceBreakdowns({ geoData, demographicData }: AudienceBreakdownsProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px", marginBottom: "28px" }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px" }}>
            Regione / Citta
          </h3>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Top localita per spesa nel periodo selezionato.
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "420px" }}>
            <thead>
              <tr>
                <th style={{ ...cellStyle("left"), borderTop: "none", color: "var(--text-primary)" }}>Regione</th>
                <th style={{ ...cellStyle("left"), borderTop: "none", color: "var(--text-primary)" }}>Citta</th>
                <th style={{ ...cellStyle("right"), borderTop: "none", color: "var(--text-primary)" }}>Spesa</th>
                <th style={{ ...cellStyle("right"), borderTop: "none", color: "var(--text-primary)" }}>Lead</th>
              </tr>
            </thead>
            <tbody>
              {geoData.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ ...cellStyle("left"), color: "var(--text-muted)", textAlign: "center", padding: "18px" }}>
                    Breakdown geografico non disponibile.
                  </td>
                </tr>
              ) : (
                geoData.map((row, idx) => (
                  <tr key={`${row.region}-${row.city}-${idx}`} style={{ background: idx % 2 ? "rgba(79, 70, 229, 0.02)" : "transparent" }}>
                    <td style={cellStyle("left")}>{row.region}</td>
                    <td style={cellStyle("left")}>{row.city}</td>
                    <td style={cellStyle("right")}>{formatCurrency(row.spend)}</td>
                    <td style={cellStyle("right")}>{formatNumber(row.leads)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px" }}>
            Eta / Genere
          </h3>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Distribuzione demografica delle performance.
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "420px" }}>
            <thead>
              <tr>
                <th style={{ ...cellStyle("left"), borderTop: "none", color: "var(--text-primary)" }}>Eta</th>
                <th style={{ ...cellStyle("left"), borderTop: "none", color: "var(--text-primary)" }}>Genere</th>
                <th style={{ ...cellStyle("right"), borderTop: "none", color: "var(--text-primary)" }}>CTR</th>
                <th style={{ ...cellStyle("right"), borderTop: "none", color: "var(--text-primary)" }}>CPL</th>
              </tr>
            </thead>
            <tbody>
              {demographicData.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ ...cellStyle("left"), color: "var(--text-muted)", textAlign: "center", padding: "18px" }}>
                    Breakdown demografico non disponibile.
                  </td>
                </tr>
              ) : (
                demographicData.map((row, idx) => (
                  <tr key={`${row.age}-${row.gender}-${idx}`} style={{ background: idx % 2 ? "rgba(79, 70, 229, 0.02)" : "transparent" }}>
                    <td style={cellStyle("left")}>{row.age}</td>
                    <td style={cellStyle("left")}>{row.gender}</td>
                    <td style={cellStyle("right")}>{formatPercent(row.ctr)}</td>
                    <td style={cellStyle("right")}>{row.cpl ? formatCurrency(row.cpl) : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
