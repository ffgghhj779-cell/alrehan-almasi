export const VAT_RATE = 0.15;

export type PricedLine = {
  unitPrice: number;
  quantity: number;
};

export function calculateOrderTotals(items: PricedLine[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const subtotalRounded = Math.round(subtotal * 100) / 100;
  const vatAmount = Math.round(subtotalRounded * VAT_RATE * 100) / 100;
  const total = Math.round((subtotalRounded + vatAmount) * 100) / 100;

  return {
    subtotal: subtotalRounded,
    vatAmount,
    total,
  };
}

export function formatSar(amount: number): string {
  return `${amount.toFixed(2)} ر.س`;
}
