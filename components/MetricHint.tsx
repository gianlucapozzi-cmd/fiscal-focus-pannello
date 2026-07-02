"use client";

import { HelpCircle } from "lucide-react";

interface MetricHintProps {
  text: string;
  /** Colore icona (default: testo secondario). Utile su sfondi colorati. */
  iconColor?: string;
  /** Posizionamento tooltip rispetto all'icona. */
  placement?: "top" | "bottom";
  /** Allineamento orizzontale tooltip. */
  align?: "center" | "right";
}

/** Icona con tooltip: passa il mouse (o focus da tastiera) per leggere la spiegazione della metrica. */
export function MetricHint({
  text,
  iconColor,
  placement = "bottom",
  align = "center",
}: MetricHintProps) {
  const bubbleClass = [
    "metric-hint-bubble",
    placement === "top" ? "metric-hint-bubble--top" : "",
    align === "right" ? "metric-hint-bubble--right" : "",
  ].filter(Boolean).join(" ");

  return (
    <span
      className="metric-hint-wrap"
      tabIndex={0}
      aria-label={`Informazioni: ${text}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <HelpCircle
        size={13}
        strokeWidth={2}
        style={{
          color: iconColor ?? "var(--text-secondary)",
          cursor: "help",
          flexShrink: 0,
          opacity: 0.85,
        }}
        aria-hidden
      />
      <span className={bubbleClass} role="tooltip">
        {text}
      </span>
    </span>
  );
}
