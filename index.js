const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Hardcoded expenses
const expenses = [
  { id: 1,  description: 'Grocery Shopping',   amount: 65.50,  date: '2024-01-15', category: 'Food' },
  { id: 2,  description: 'Gas',                amount: 45.00,  date: '2024-01-14', category: 'Transport' },
  { id: 3,  description: 'Restaurant Dinner',  amount: 82.75,  date: '2024-01-13', category: 'Food' },
  { id: 4,  description: 'Netflix',            amount: 15.99,  date: '2024-01-12', category: 'Entertainment' },
  { id: 5,  description: 'Electric Bill',      amount: 120.00, date: '2024-01-10', category: 'Utilities' },
  { id: 6,  description: 'Gym Membership',     amount: 49.99,  date: '2024-01-09', category: 'Health' },
  { id: 7,  description: 'Online Shopping',    amount: 134.25, date: '2024-01-08', category: 'Shopping' },
  { id: 8,  description: 'Coffee Shop',        amount: 18.50,  date: '2024-01-07', category: 'Food' },
  { id: 9,  description: 'Bus Pass',           amount: 30.00,  date: '2024-01-06', category: 'Transport' },
  { id: 10, description: 'Doctor Visit',       amount: 75.00,  date: '2024-01-05', category: 'Health' },
  { id: 11, description: 'Water Bill',         amount: 38.00,  date: '2024-01-04', category: 'Utilities' },
  { id: 12, description: 'Movie Tickets',      amount: 28.00,  date: '2024-01-03', category: 'Entertainment' },
  { id: 13, description: 'Supermarket',        amount: 95.40,  date: '2024-01-02', category: 'Food' },
  { id: 14, description: 'Clothing Store',     amount: 210.00, date: '2024-01-01', category: 'Shopping' },
  { id: 15, description: 'Spotify',            amount: 9.99,   date: '2023-12-31', category: 'Entertainment' },
  { id: 16, description: 'Internet Bill',      amount: 60.00,  date: '2023-12-30', category: 'Utilities' },
  { id: 17, description: 'Pharmacy',           amount: 22.75,  date: '2023-12-28', category: 'Health' },
  { id: 18, description: 'Takeout',            amount: 54.00,  date: '2023-12-27', category: 'Food' },
  { id: 19, description: 'Fuel',               amount: 55.00,  date: '2023-12-25', category: 'Transport' },
  { id: 20, description: 'Books',              amount: 42.00,  date: '2023-12-22', category: 'Shopping' }
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

app.get('/api/stats', (req, res) => {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avg = total / expenses.length;
  const highest = expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]);

  // Category totals
  const byCategory = {};
  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  // Monthly totals (last 6 months)
  const monthly = {};
  expenses.forEach(e => {
    const month = e.date.substring(0, 7);
    monthly[month] = (monthly[month] || 0) + e.amount;
  });

  const sortedMonths = Object.keys(monthly).sort();
  const last6 = sortedMonths.slice(-6);
  const monthlyData = last6.map(m => ({ month: m, total: parseFloat(monthly[m].toFixed(2)) }));

  res.json({
    totalExpenses: parseFloat(total.toFixed(2)),
    totalCount: expenses.length,
    avgExpense: parseFloat(avg.toFixed(2)),
    highestExpense: highest,
    byCategory: Object.entries(byCategory).map(([name, amount]) => ({
      name,
      amount: parseFloat(amount.toFixed(2))
    })).sort((a, b) => b.amount - a.amount),
    monthly: monthlyData,
    recent: [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  });
});

app.post('/api/expenses', (req, res) => {
  const { description, amount, date } = req.body;
  const newExpense = {
    id: expenses.length + 1,
    description,
    amount: parseFloat(amount),
    date,
    category: req.body.category || 'Other'
  };
  expenses.push(newExpense);
  res.json(newExpense);
});

app.listen(PORT, () => {
  console.log(`Expense tracker running at http://localhost:${PORT}`);
});
