export const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export const percent = (value: number) => `${Math.round(Number.isFinite(value) ? value : 0)}%`;
