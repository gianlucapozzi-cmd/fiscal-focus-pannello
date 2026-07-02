"use client";

import { DailyData } from "@/lib/types";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { METRIC_HELP } from "@/lib/metricHelp";
import { MetricHint } from "@/components/MetricHint";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { useState } from "react";

interface SpendChartProps {
  data: DailyData[];
}

type ChartMetric = "spend" | "impressions" | "clicks" | "leads";

const METRICS: {
  key: ChartMetric;
  label: string;
  color: string;
  help: string;
  format: (v: number) => string;
}[] = [
  { key: "spend", label: "Spesa (€)", color: "#6366f1", help: METRIC_HELP.chart_spend, format: (v) => formatCurrency(v) },
  { key: "impressions", label: "Impression", color: "#22c55e", help: METRIC_HELP.chart_impressions, format: (v) => v.toLocaleString("it-IT") },
  { key: "clicks", label: "Click", color: "#f59e0b", help: METRIC_HELP.chart_clicks, format: (v) => v.toLocaleString("it-IT") },
  { key: "leads", label: "Lead", color: "#ec4899", help: METRIC_HELP.chart_leads, format: (v) => String(v) },
];

export function SpendChart({ data }: SpendChartProps) {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>("spend");
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const metric = METRICS.find((m) => m.key === activeMetric)!;

  const formatted = data.map((d) => ({
    ...d,
    date: formatShortDate(d.date),
  }));

  const CustomTooltip = ({ active, payload, label }: {active?: boolean; payload?: {value: number}[]; label?: string}) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-accent)",
          borderRadius: "8px",
          padding: "10px 14px",
          fontFamily: "var(--font-body)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        }}>
          <div style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }}>{label}</div>
          <div style={{ color: metric.color, fontSize: "15px", fontWeight: 600 }}>
            {metric.format(payload[0].value)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ flex: "1 1 200px", minWidth: 0 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
            Andamento nel tempo
          </h3>
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              marginTop: "8px",
              lineHeight: 1.5,
              maxWidth: "520px",
            }}
          >
            {metric.help}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Metric selector */}
          <div style={{ display: "flex", gap: "4px", padding: "3px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            {METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveMetric(m.key)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontFamily: "var(--font-body)",
                  background: activeMetric === m.key ? m.color : "transparent",
                  color: activeMetric === m.key ? "#fff" : "var(--text-primary)",
                  transition: "all 0.15s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {m.label}
                <span
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: "inline-flex", opacity: activeMetric === m.key ? 0.95 : 1 }}
                >
                  <MetricHint
                    text={m.help}
                    iconColor={activeMetric === m.key ? "rgba(255,255,255,0.92)" : undefined}
                  />
                </span>
              </button>
            ))}
          </div>

          {/* Chart type */}
          <div style={{ display: "flex", gap: "4px", padding: "3px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            {(["area", "bar"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontFamily: "var(--font-body)",
                  background: chartType === t ? "var(--border-accent)" : "transparent",
                  color: chartType === t ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                {t === "area" ? "Area" : "Barre"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "13px", fontFamily: "var(--font-body)" }}>
          Nessun dato disponibile per il periodo selezionato
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          {chartType === "area" ? (
            <AreaChart data={formatted} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metric.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => activeMetric === "spend" ? `€${v}` : v.toLocaleString("it-IT")}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={metric.color}
                strokeWidth={2}
                fill="url(#colorGradient)"
                dot={false}
                activeDot={{ r: 4, fill: metric.color, stroke: "var(--bg-card)", strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={formatted} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => activeMetric === "spend" ? `€${v}` : String(v)}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={activeMetric} fill={metric.color} radius={[3, 3, 0, 0]} maxBarSize={24} />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
