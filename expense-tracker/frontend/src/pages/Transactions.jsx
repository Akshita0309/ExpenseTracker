import React, { useEffect, useState } from 'react';
import { useExpense } from '../hooks/useExpense';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import categoryService from '../services/categoryService';

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

function CategoryForm({ onCreated, onCancel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [color, setColor] = useState('#6C7BF0');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const created = await categoryService.create({ name, type, color });
      onCreated(created);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Name</label>
        <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Color</label>
          <input className="form-input" type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ padding: 4, height: 40 }} />
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create category'}
        </button>
      </div>
    </form>
  );
}

export default function Transactions() {
  const {
    transactions, categories,
    refreshTransactions, refreshCategories,
    addTransaction, editTransaction, removeTransaction,
  } = useExpense();

  const [showTxModal, setShowTxModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    refreshCategories();
    refreshTransactions();
  }, []);

  const filtered = transactions.filter((t) => typeFilter === 'ALL' || t.type === typeFilter);

  const openCreate = () => {
    setEditingTx(null);
    setShowTxModal(true);
  };

  const openEdit = (tx) => {
    setEditingTx(tx);
    setShowTxModal(true);
  };

  const handleSubmit = async (payload) => {
    setError('');
    try {
      if (editingTx) {
        await editTransaction(editingTx.id, payload);
      } else {
        await addTransaction(payload);
      }
      setShowTxModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      await removeTransaction(id);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <div className="page-sub">{transactions.length} total entries</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setShowCatModal(true)}>+ Category</button>
          <button className="btn btn-primary" onClick={openCreate}>+ Add transaction</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['ALL', 'INCOME', 'EXPENSE'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${typeFilter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTypeFilter(f)}
          >
            {f === 'ALL' ? 'All' : f === 'INCOME' ? 'Income' : 'Expense'}
          </button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">No transactions to show yet.</div>
        ) : (
          <>
            <div className="ledger-header">
              <span></span><span>Category</span><span>Date</span><span>Amount</span><span></span>
            </div>
            <div className="ledger">
              {filtered.map((t) => (
                <TransactionCard key={t.id} transaction={t} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </div>

      {showTxModal && (
        <Modal title={editingTx ? 'Edit transaction' : 'Add transaction'} onClose={() => setShowTxModal(false)}>
          {categories.length === 0 ? (
            <div className="empty-state">Create a category first using the "+ Category" button.</div>
          ) : (
            <>
              {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
              <TransactionForm
                categories={categories}
                initialValue={editingTx}
                onSubmit={handleSubmit}
                onCancel={() => setShowTxModal(false)}
              />
            </>
          )}
        </Modal>
      )}

      {showCatModal && (
        <Modal title="New category" onClose={() => setShowCatModal(false)}>
          <CategoryForm
            onCreated={() => { refreshCategories(); setShowCatModal(false); }}
            onCancel={() => setShowCatModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
