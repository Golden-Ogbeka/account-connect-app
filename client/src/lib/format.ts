export const formatAmount = (kobo: number): string => {
  const negative = kobo < 0;
  const abs = Math.abs(kobo);
  const naira = abs / 100;
  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(naira);
  return negative ? `(${formatted.replace('-', '')})` : formatted;
};

export const formatShortDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
};
