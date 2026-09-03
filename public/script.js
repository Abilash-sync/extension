const expensesList = document.getElementById('expensesList');
const totalAmount = document.getElementById('totalAmount');
const expenseForm = document.getElementById('expenseForm');

let expenses = [];

// Fetch and display expenses on page load
async function loadExpenses() {
  try {
    const response = await fetch('/api/expenses');
    expenses = await response.json();
    renderExpenses();
  } catch (error) {
    console.error('Error loading expenses:', error);
  }
}

function renderExpenses() {
  expensesList.innerHTML = '';
  
  if (expenses.length === 0) {
    expensesList.innerHTML = '<tr><td colspan="3" class="empty-state"><p>No expenses yet. Add one to get started!</p></td></tr>';
    totalAmount.textContent = '$0.00';
    return;
  }

  let total = 0;
  expenses.forEach(expense => {
    total += expense.amount;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense.description}</td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td>${formatDate(expense.date)}</td>
    `;
    expensesList.appendChild(row);
  });

  totalAmount.textContent = `$${total.toFixed(2)}`;
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Handle form submission
expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;

  try {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description, amount, date, category })
    });

    if (response.ok) {
      const newExpense = await response.json();
      expenses.push(newExpense);
      renderExpenses();
      expenseForm.reset();
      // Reset date to today
      document.getElementById('date').valueAsDate = new Date();
    }
  } catch (error) {
    console.error('Error adding expense:', error);
  }
});

// Initialize on load
loadExpenses();
// Set date input default to today
document.getElementById('date').valueAsDate = new Date();
