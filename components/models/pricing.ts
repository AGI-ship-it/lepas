import { formatCurrency } from "@/lib/financeMath";
import type { Dictionary } from "@/lib/i18n";

// Lepas UAE publishes monthly offer prices, not cash prices (lepasuae.com/offers).
export const MONTHLY_FROM: Record<string, number> = {
  l8: 1533,
  l4: 1135,
};

export function monthlyFromLabel(slug: string, currency: string, dict: Dictionary) {
  const monthly = MONTHLY_FROM[slug];
  return monthly ? `${formatCurrency(monthly, currency)} ${dict.finance.perMonth}` : null;
}
