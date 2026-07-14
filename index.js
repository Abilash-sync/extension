const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Hardcoded expenses
const expenses = [
  { id: 1, description: 'Grocery Shopping', amount: 65.50, date: '2024-01-15' },
  { id: 2, description: 'Gas', amount: 45.00, date: '2024-01-14' },
  { id: 3, description: 'Restaurant Dinner', amount: 82.75, date: '2024-01-13' }
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const { description, amount, date } = req.body;
  const newExpense = {
    id: expenses.length + 1,
    description,
    amount: parseFloat(amount),
    date
  };
  expenses.push(newExpense);
  res.json(newExpense);
});

app.listen(PORT, () => {
  console.log(`Expense tracker running at http://localhost:${PORT}`);
});
