import React, { useState, useEffect } from 'react';

const emptyForm = {
  amount: '',
  type: 'EXPENSE',
  description: '',
  transactionDate: new Date().toISOString().split('T')[0],
  categoryId: '',
};

export default function TransactionForm({ categories, initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        amount: initialValue.amount,
        type: initialValue.type,
        description: initialValue.description || '',
        transactionDate: initialValue.transactionDate,
        categoryId: initialValue.categoryId,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialValue]);

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Enter an amount greater than 0';
    if (!form.categoryId) next.categoryId = 'Choose a category';
    if (!form.transactionDate) next.transactionDate = 'Choose a date';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        amount: Number(form.amount),
        type: form.type,
        description: form.description,
        transactionDate: form.transactionDate,
        categoryId: Number(form.categoryId),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select" value={form.type} onChange={handleChange('type')}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            className="form-input"
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={handleChange('amount')}
            placeholder="0.00"
          />
          {errors.amount && <div className="form-error">{errors.amount}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <select className="form-select" value={form.categoryId} onChange={handleChange('categoryId')}>
          <option value="">Select a category</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <div className="form-error">{errors.categoryId}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Date</label>
        <input
          className="form-input"
          type="date"
          value={form.transactionDate}
          onChange={handleChange('transactionDate')}
        />
        {errors.transactionDate && <div className="form-error">{errors.transactionDate}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Description (optional)</label>
        <input
          className="form-input"
          type="text"
          value={form.description}
          onChange={handleChange('description')}
          placeholder="e.g. Weekly groceries"
        />
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : initialValue ? 'Save changes' : 'Add transaction'}
        </button>
      </div>
    </form>
  );
}
