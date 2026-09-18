import React, { useEffect, useState } from 'react';
import reportService from '../services/reportService';
import SummaryCard from '../components/SummaryCard';
import Chart from '../components/Chart';
import { formatCurrency } from '../utils/formatCurrency';
import { currentMonthYear } from '../utils/formatDate';

export default function Reports() {
  const now = currentMonthYear();
  const [month, setMonth] = useState(now.month);
  const [year, setYear] = useState(now.year);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await reportService.getMonthly(month, year);
      setReport(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [month, year]);

  const download = async (kind) => {
    setExporting(kind);
    try {
      const blob = kind === 'pdf'
        ? await reportService.downloadPdf(month, year)
        : await reportService.downloadExcel(month, year);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${year}-${String(month).padStart(2, '0')}.${kind === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting('');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <div className="page-sub">Monthly income, expenses and category breakdown</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="form-select" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            className="form-input"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ width: 90 }}
          />
        </div>
      </div>

      {!loading && report && (
        <>
          <div className="card-grid">
            <SummaryCard label="Income" amount={report.totalIncome} tone="positive" />
            <SummaryCard label="Expenses" amount={report.totalExpense} tone="negative" />
            <SummaryCard label="Net savings" amount={report.netSavings} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card">
              <div className="section-title">Category breakdown</div>
              <Chart data={report.categoryBreakdown} />
            </div>

            <div className="card">
              <div className="flex-between" style={{ marginBottom: 14 }}>
                <div className="section-title" style={{ marginBottom: 0 }}>Export</div>
              </div>
              <p className="text-dim" style={{ fontSize: 13.5, marginBottom: 16 }}>
                Download this period's transactions as a PDF or Excel file.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => download('pdf')} disabled={exporting === 'pdf'}>
                  {exporting === 'pdf' ? 'Preparing PDF...' : 'Download PDF'}
                </button>
                <button className="btn btn-secondary" onClick={() => download('excel')} disabled={exporting === 'excel'}>
                  {exporting === 'excel' ? 'Preparing Excel...' : 'Download Excel'}
                </button>
              </div>

              {report.categoryBreakdown.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  {report.categoryBreakdown.map((c) => (
                    <div key={c.categoryId} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                      <span>{c.categoryName}</span>
                      <span className="mono">{formatCurrency(c.amount)} &middot; {c.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
