"use client";

import { HelpCircle } from "lucide-react";

interface MetricHintProps {
  text: string;
  /** Colore icona (default: testo secondario). Utile su sfondi colorati. */
  iconColor?: string;
}

/** Icona con tooltip: passa il mouse (o focus da tastiera) per leggere la spiegazione della metrica. */
export function MetricHint({ text, iconColor }: MetricHintProps) {
  return (
    <span
      className="metric-hint-wrap"
      title={text}
      tabIndex={0}
      aria-label={`Informazioni: ${text}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <HelpCircle
        size={13}
        strokeWidth={2}
        style={{
          color: iconColor ?? "var(--text-muted)",
          cursor: "help",
          flexShrink: 0,
          opacity: 0.85,
        }}
        aria-hidden
      />
      <span className="metric-hint-bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}
