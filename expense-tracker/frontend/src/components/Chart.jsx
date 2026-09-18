import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';

const PALETTE = ['#6C7BF0', '#3DD68C', '#F2B94B', '#4EC5D9', '#F1707A', '#B084F0', '#F09A5C'];

export default function Chart({ data }) {
  if (!data || data.length === 0) {
    return <div className="empty-state">No expense data for this period yet.</div>;
  }

  const total = data.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  return (
    <div>
      <div className="donut-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={96}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={entry.categoryId} fill={PALETTE[index % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1D212B', border: '1px solid #272B35', borderRadius: 8, color: '#E9EBEF', fontSize: 13 }}
              formatter={(value) => formatCurrency(value)}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <span className="donut-center-label">Total spent</span>
          <span className="donut-center-value mono">{formatCurrency(total)}</span>
        </div>
      </div>
      <div className="chart-legend">
        {data.map((entry, index) => (
          <div className="chart-legend-row" key={entry.categoryId}>
            <span className="pill-dot" style={{ background: PALETTE[index % PALETTE.length] }} />
            <span className="chart-legend-name">{entry.categoryName}</span>
            <span className="chart-legend-pct text-dim">{Math.round(entry.percentage || 0)}%</span>
            <span className="chart-legend-amount mono">{formatCurrency(entry.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
