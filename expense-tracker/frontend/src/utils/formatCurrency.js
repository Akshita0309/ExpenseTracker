export function formatCurrency(amount, currency = "INR", locale = "en-IN") {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
