import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import './AnalyticsPage.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ab47bc', '#26a69a', '#ffa726', '#ef5350'];

const AnalyticsPage = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, []);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map((key) => ({
    name: key,
    value: categoryTotals[key],
  }));

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const numberOfTransactions = expenses.length;

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const averagePerDay = (() => {
    if (expenses.length === 0) return 0;
    const dates = expenses.map(e => new Date(e.date)).sort((a, b) => a - b);
    const daysSpan = (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24) + 1;
    return (totalSpent / daysSpan).toFixed(2);
  })();

  // 📆 Prepare Monthly Totals
  const monthlyDataMap = {};
  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const month = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    if (!monthlyDataMap[month]) monthlyDataMap[month] = {};
    monthlyDataMap[month][exp.category] = (monthlyDataMap[month][exp.category] || 0) + Number(exp.amount);
  });

  const monthlyChartData = Object.keys(monthlyDataMap).map(month => ({
    month,
    ...monthlyDataMap[month],
  }));

  const categories = [...new Set(expenses.map(e => e.category))];

  return (
    <div className="analytics-container">
      <h2>📊 Expense Distribution by Category</h2>

      <div className="metrics">
        <div className="metric-card">💰 Total Spent: ₹{totalSpent}</div>
        <div className="metric-card">🧾 Transactions: {numberOfTransactions}</div>
        <div className="metric-card">🔥 Top Category: {topCategory ? topCategory[0] : 'N/A'}</div>
        <div className="metric-card">📆 Avg per Day: ₹{averagePerDay}</div>
      </div>

      {chartData.length > 0 && (
        <div className="chart-wrapper">
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}

      {/* 📆 Monthly Totals by Category */}
      <h2 style={{ marginTop: '40px' }}>📅 Monthly Totals by Category</h2>
      {monthlyChartData.length === 0 ? (
        <p>No data available for monthly totals.</p>
      ) : (
        <div className="bar-chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {categories.map((cat, index) => (
                <Bar
                  key={cat}
                  dataKey={cat}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
