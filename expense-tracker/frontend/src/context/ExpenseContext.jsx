import React, { createContext, useState, useCallback } from 'react';
import transactionService from '../services/transactionService';
import categoryService from '../services/categoryService';
import budgetService from '../services/budgetService';

export const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshCategories = useCallback(async () => {
    const data = await categoryService.getAll();
    setCategories(data);
    return data;
  }, []);

  const refreshTransactions = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await transactionService.getAll(filters);
      setTransactions(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBudgets = useCallback(async (month, year) => {
    const data = await budgetService.getAll(month, year);
    setBudgets(data);
    return data;
  }, []);

  const refreshAlerts = useCallback(async () => {
    const data = await budgetService.getAlerts();
    setAlerts(data);
    return data;
  }, []);

  const addTransaction = useCallback(async (payload) => {
    const created = await transactionService.create(payload);
    setTransactions((prev) => [created, ...prev]);
    return created;
  }, []);

  const editTransaction = useCallback(async (id, payload) => {
    const updated = await transactionService.update(id, payload);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTransaction = useCallback(async (id) => {
    await transactionService.remove(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    transactions,
    categories,
    budgets,
    alerts,
    loading,
    refreshCategories,
    refreshTransactions,
    refreshBudgets,
    refreshAlerts,
    addTransaction,
    editTransaction,
    removeTransaction,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}
