export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("it-IT").format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(isoString?: string): string {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatShortDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
  });
}

export function statusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "PAUSED":
      return "paused";
    case "ARCHIVED":
    case "DELETED":
      return "archived";
    default:
      return "unknown";
  }
}

export function statusLabel(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "Attiva";
    case "PAUSED":
      return "In pausa";
    case "ARCHIVED":
      return "Archiviata";
    case "DELETED":
      return "Eliminata";
    default:
      return status;
  }
}

export function getCampaignAge(start_time?: string): string {
  if (!start_time) return "—";
  const start = new Date(start_time);
  const now = new Date();
  const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "oggi";
  if (days === 1) return "ieri";
  return `${days}gg`;
}
