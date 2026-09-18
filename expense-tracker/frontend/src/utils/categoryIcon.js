// Small heuristic so category rows get a face instead of a bare dot.
// Falls back gracefully for any category name the user makes up.
const KEYWORD_ICONS = [
  [['grocery', 'groceries', 'food', 'dining', 'restaurant'], 'ti-tools-kitchen-2'],
  [['rent', 'mortgage', 'housing', 'home'], 'ti-home'],
  [['transport', 'fuel', 'gas', 'uber', 'taxi', 'commute'], 'ti-car'],
  [['salary', 'payroll', 'wage', 'income', 'paycheck'], 'ti-briefcase'],
  [['freelance', 'invoice', 'client'], 'ti-file-invoice'],
  [['utilities', 'electric', 'water', 'internet', 'bill', 'phone'], 'ti-bolt'],
  [['health', 'medical', 'pharmacy', 'doctor'], 'ti-heart-rate-monitor'],
  [['entertainment', 'movie', 'streaming', 'game'], 'ti-device-tv'],
  [['shopping', 'clothes', 'clothing', 'apparel'], 'ti-shopping-bag'],
  [['travel', 'flight', 'hotel', 'vacation'], 'ti-plane'],
  [['education', 'tuition', 'course', 'school'], 'ti-school'],
  [['insurance'], 'ti-shield-check'],
  [['gift', 'donation', 'charity'], 'ti-gift'],
  [['savings', 'investment', 'stock'], 'ti-pig-money'],
  [['subscription'], 'ti-refresh'],
  [['loan', 'debt', 'credit'], 'ti-credit-card'],
  [['pet'], 'ti-paw'],
];

export function categoryIcon(name = '', type = 'EXPENSE') {
  const lower = name.toLowerCase();
  for (const [keywords, icon] of KEYWORD_ICONS) {
    if (keywords.some((k) => lower.includes(k))) return icon;
  }
  return type === 'INCOME' ? 'ti-cash' : 'ti-receipt-2';
}
