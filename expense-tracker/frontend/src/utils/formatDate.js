export function formatDate(dateString, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

export function toIsoDate(date) {
  return date.toISOString().split('T')[0];
}

export function currentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}
