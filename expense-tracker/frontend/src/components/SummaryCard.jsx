import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

const ICONS = {
  positive: 'ti-arrow-up-right',
  negative: 'ti-arrow-down-right',
  neutral: 'ti-pig-money',
};

export default function SummaryCard({ label, amount, tone, highlight, sub }) {
  const toneClass = tone === 'positive' ? 'positive' : tone === 'negative' ? 'negative' : '';
  const icon = ICONS[tone] || ICONS.neutral;

  return (
    <div className={`card summary-card${highlight ? ' summary-card-highlight' : ''}`}>
      <div className="summary-card-top">
        <div className={`summary-icon ${toneClass}`}>
          <i className={`ti ${icon}`} aria-hidden="true" />
        </div>
        <div className="label">{label}</div>
      </div>
      <div className={`value ${toneClass}`}>{formatCurrency(amount)}</div>
      {sub && <div className="summary-sub">{sub}</div>}
    </div>
  );
}
