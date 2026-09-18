import React, { useEffect, useState } from 'react';
import { useExpense } from '../hooks/useExpense';
import BudgetCard from '../components/BudgetCard';
import AlertCard from '../components/AlertCard';
import budgetService from '../services/budgetService';
import { currentMonthYear } from '../utils/formatDate';

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BudgetForm({ categories, initialValue, defaultMonth, defaultYear, onSubmit, onCancel }) {
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');
  const [categoryId, setCategoryId] = useState(initialValue?.categoryId || '');
  const [limitAmount, setLimitAmount] = useState(initialValue?.limitAmount || '');
  const [month, setMonth] = useState(initialValue?.month || defaultMonth);
  const [year, setYear] = useState(initialValue?.year || defaultYear);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!categoryId || !limitAmount) {
      setError('Fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        categoryId: Number(categoryId),
        limitAmount: Number(limitAmount),
        month: Number(month),
        year: Number(year),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save budget');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Category</label>
        <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select an expense category</option>
          {expenseCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Monthly limit</label>
        <input className="form-input" type="number" min="0.01" step="0.01" value={limitAmount} onChange={(e) => setLimitAmount(e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Month</label>
          <input className="form-input" type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Year</label>
          <input className="form-input" type="number" min="2000" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : initialValue ? 'Save changes' : 'Create budget'}
        </button>
      </div>
    </form>
  );
}

export default function Budgets() {
  const {
    budgets, categories, alerts,
    refreshBudgets, refreshCategories, refreshAlerts,
  } = useExpense();

  const { month, year } = currentMonthYear();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadAll = () => {
    refreshCategories();
    refreshBudgets(month, year);
    refreshAlerts();
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreate = async (payload) => {
    await budgetService.create(payload);
    setShowModal(false);
    refreshBudgets(month, year);
  };

  const handleEdit = async (payload) => {
    await budgetService.update(editing.id, payload);
    setEditing(null);
    setShowModal(false);
    refreshBudgets(month, year);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      await budgetService.remove(id);
      refreshBudgets(month, year);
    }
  };

  const handleMarkRead = async (id) => {
    await budgetService.markAlertRead(id);
    refreshAlerts();
  };

  const openCreate = () => { setEditing(null); setShowModal(true); };
  const openEdit = (b) => { setEditing(b); setShowModal(true); };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Budgets</h1>
          <div className="page-sub">{month}/{year} limits by category</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New budget</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div>
          {budgets.length === 0 ? (
            <div className="card"><div className="empty-state">No budgets set for this month yet.</div></div>
          ) : (
            budgets.map((b) => (
              <BudgetCard key={b.id} budget={b} onEdit={openEdit} onDelete={handleDelete} />
            ))
          )}
        </div>

        <div className="card">
          <div className="section-title">Alerts</div>
          {alerts.length === 0 ? (
            <div className="empty-state">No alerts. You're within budget everywhere.</div>
          ) : (
            alerts.map((a) => <AlertCard key={a.id} alert={a} onMarkRead={handleMarkRead} />)
          )}
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit budget' : 'New budget'} onClose={() => setShowModal(false)}>
          <BudgetForm
            categories={categories}
            initialValue={editing}
            defaultMonth={month}
            defaultYear={year}
            onSubmit={editing ? handleEdit : handleCreate}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
