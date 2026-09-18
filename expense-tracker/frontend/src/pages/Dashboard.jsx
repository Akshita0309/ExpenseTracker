import React, { useEffect, useState } from 'react';
import { useExpense } from '../hooks/useExpense';
import SummaryCard from '../components/SummaryCard';
import Chart from '../components/Chart';
import TransactionCard from '../components/TransactionCard';
import reportService from '../services/reportService';
import { currentMonthYear } from '../utils/formatDate';

export default function Dashboard() {
  const { transactions, categories, refreshTransactions, refreshCategories } = useExpense();
  const [report, setReport] = useState(null);
  const { month, year } = currentMonthYear();

  useEffect(() => {
    refreshCategories();
    refreshTransactions();
    reportService.getMonthly(month, year).then(setReport).catch(() => {});
  }, []);

  const recent = transactions.slice(0, 6);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <div className="page-sub">This month at a glance</div>
        </div>
      </div>

      <div className="card-grid">
        <SummaryCard label="Income" amount={report?.totalIncome || 0} tone="positive" />
        <SummaryCard label="Expenses" amount={report?.totalExpense || 0} tone="negative" />
        <SummaryCard
          label="Net savings"
          amount={report?.netSavings || 0}
          tone={report?.netSavings < 0 ? 'negative' : 'positive'}
          highlight
          sub="Income minus expenses, this month"
        />
      </div>

      <div className="dashboard-columns">
        <div className="card">
          <div className="flex-between" style={{ marginBottom: 14 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Recent transactions</div>
            <a href="/transactions" className="section-link">View all</a>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">No transactions yet. Add your first one from the Transactions page.</div>
          ) : (
            <div className="ledger">
              {recent.map((t) => (
                <TransactionCard key={t.id} transaction={t} onEdit={() => {}} onDelete={() => {}} />
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-title">Spending by category</div>
          <Chart data={report?.categoryBreakdown || []} />
        </div>
      </div>

      {categories.length === 0 && (
        <div className="card mt-24">
          <div className="section-title">Get started</div>
          <p className="text-dim">
            You don't have any categories yet. Head to the Transactions page to create your first income or expense
            category, then start logging transactions.
          </p>
        </div>
      )}
    </div>
  );
}
