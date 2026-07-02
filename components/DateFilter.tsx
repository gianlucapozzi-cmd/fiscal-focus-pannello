"use client";

import { useState } from "react";
import { DatePreset } from "@/lib/types";

interface DateFilterProps {
  selected: DatePreset;
  onChange: (preset: DatePreset) => void;
}

const PRESETS: { value: DatePreset; label: string }[] = [
  { value: "today", label: "Oggi" },
  { value: "yesterday", label: "Ieri" },
  { value: "last_7_days", label: "7 giorni" },
  { value: "last_14_days", label: "14 giorni" },
  { value: "this_month", label: "Questo mese" },
  { value: "last_30_days", label: "30 giorni" },
  { value: "last_month", label: "Mese scorso" },
  { value: "last_90_days", label: "90 giorni" },
  { value: "this_year", label: "Quest'anno" },
];

export function DateFilter({ selected, onChange }: DateFilterProps) {
  return (
    <div style={{
      display: "flex",
      gap: "6px",
      padding: "6px",
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      flexWrap: "wrap",
      boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
    }}>
      {PRESETS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          style={{
            padding: "7px 14px",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: selected === p.value ? "var(--accent)" : "transparent",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "var(--font-body)",
            transition: "all 0.15s",
            background: selected === p.value ? "var(--accent)" : "transparent",
            color: selected === p.value ? "#fff" : "var(--text-primary)",
            fontWeight: selected === p.value ? 500 : 400,
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
