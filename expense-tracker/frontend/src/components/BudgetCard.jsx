import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { categoryIcon } from '../utils/categoryIcon';

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const pct = Math.min(budget.percentUsed || 0, 100);
  const over = budget.spentAmount > budget.limitAmount;
  const barColor = over ? 'var(--expense)' : pct > 90 ? '#F2B94B' : 'var(--income)';

  return (
    <div className="card budget-card">
      <div className="budget-card-top">
        <div className="budget-card-title">
          <div className="ledger-avatar" style={{ background: 'var(--accent-dim)', color: 'var(--accent-hover)' }}>
            <i className={`ti ${categoryIcon(budget.categoryName, 'EXPENSE')}`} aria-hidden="true" />
          </div>
          <div>
            <strong>{budget.categoryName}</strong>
            <div className="text-dim" style={{ fontSize: 12.5, marginTop: 2 }}>
              {budget.month}/{budget.year}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="icon-btn icon-only" onClick={() => onEdit(budget)} title="Edit">
            <i className="ti ti-pencil" aria-hidden="true" />
          </button>
          <button className="icon-btn icon-only" onClick={() => onDelete(budget.id)} title="Delete">
            <i className="ti ti-trash" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="budget-bar-track">
        <div className="budget-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <div className="budget-meta">
        <span>{formatCurrency(budget.spentAmount)} spent</span>
        <span>{over ? 'Over budget' : `${Math.round(pct)}% used`}</span>
        <span>{formatCurrency(budget.limitAmount)} limit</span>
      </div>
    </div>
  );
}
