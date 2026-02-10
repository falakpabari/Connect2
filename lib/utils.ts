export function formatPrice(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(0)}`;
}

export function formatPriceWithSession(priceCents: number): string {
  return `${formatPrice(priceCents)}/session`;
}
