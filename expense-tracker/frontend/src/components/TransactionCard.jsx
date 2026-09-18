import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { categoryIcon } from '../utils/categoryIcon';

export default function TransactionCard({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'INCOME';
  const tint = transaction.categoryColor || (isIncome ? 'var(--income)' : 'var(--accent)');

  return (
    <div className="ledger-row">
      <div className="ledger-avatar" style={{ background: `${tint}22`, color: tint }}>
        <i className={`ti ${categoryIcon(transaction.categoryName, transaction.type)}`} aria-hidden="true" />
      </div>
      <div className="ledger-desc">
        <div className="cat-name">{transaction.categoryName}</div>
        {transaction.description && <div className="desc-text">{transaction.description}</div>}
      </div>
      <div className="ledger-date">{formatDate(transaction.transactionDate)}</div>
      <div className="ledger-amount" style={{ color: isIncome ? 'var(--income)' : 'var(--expense)' }}>
        {isIncome ? '+' : '\u2212'}{formatCurrency(transaction.amount)}
      </div>
      <div className="ledger-row-actions">
        <button className="icon-btn icon-only" onClick={() => onEdit(transaction)} title="Edit">
          <i className="ti ti-pencil" aria-hidden="true" />
        </button>
        <button className="icon-btn icon-only" onClick={() => onDelete(transaction.id)} title="Delete">
          <i className="ti ti-trash" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
