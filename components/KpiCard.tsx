"use client";

import { ReactNode } from "react";
import { MetricHint } from "@/components/MetricHint";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  accentColor?: string;
  trend?: { value: number; label: string };
  /** Testo lungo: spiegazione della metrica (tooltip). */
  help?: string;
}

export function KpiCard({ label, value, sub, icon, accentColor = "var(--accent)", trend, help }: KpiCardProps) {
  return (
    <div
      className="kpi-card"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "24px",
        position: "relative",
        overflow: "visible",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card-hover)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Glow dot */}
      <div style={{
        position: "absolute",
        top: 0, right: 0,
        width: "80px", height: "80px",
        background: accentColor,
        borderRadius: "50%",
        filter: "blur(40px)",
        opacity: 0.08,
        transform: "translate(20px, -20px)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", paddingRight: "8px" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>
            {label}
          </span>
          {help ? <MetricHint text={help} /> : null}
        </div>
        <span style={{ color: accentColor, opacity: 0.8, flexShrink: 0 }}>{icon}</span>
      </div>

      <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "4px" }}>
        {value}
      </div>

      {sub && (
        <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          {sub}
        </div>
      )}

      {trend && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          marginTop: "8px",
          padding: "2px 8px",
          borderRadius: "20px",
          fontSize: "11px",
          background: trend.value >= 0 ? "var(--green-soft)" : "var(--red-soft)",
          color: trend.value >= 0 ? "var(--green)" : "var(--red)",
        }}>
          {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value).toFixed(1)}% {trend.label}
        </div>
      )}
    </div>
  );
}
