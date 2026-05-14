export const IDR = (n: number) => new Intl
  .NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
  .format(n);

export const PCT = (n: number) => `${n}%`;