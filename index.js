const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Calculator endpoints
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/calculate', (req, res) => {
  const { operation, num1, num2 } = req.body;
  
  if (num1 === undefined || num2 === undefined || !operation) {
    return res.status(400).json({ error: 'Missing required parameters: operation, num1, num2' });
  }

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).json({ error: 'num1 and num2 must be valid numbers' });
  }

  let result;
  let errorMessage = null;

  switch (operation.toLowerCase()) {
    case 'add':
    case '+':
      result = n1 + n2;
      break;
    case 'subtract':
    case '-':
      result = n1 - n2;
      break;
    case 'multiply':
    case '*':
      result = n1 * n2;
      break;
    case 'divide':
    case '/':
      if (n2 === 0) {
        errorMessage = 'Cannot divide by zero';
        result = null;
      } else {
        result = n1 / n2;
      }
      break;
    case 'power':
    case '^':
      result = Math.pow(n1, n2);
      break;
    case 'modulo':
    case '%':
      if (n2 === 0) {
        errorMessage = 'Cannot perform modulo with divisor of zero';
        result = null;
      } else {
        result = n1 % n2;
      }
      break;
    default:
      return res.status(400).json({ error: `Unknown operation: ${operation}` });
  }

  if (errorMessage) {
    return res.status(400).json({ error: errorMessage, operation, num1: n1, num2: n2 });
  }

  res.json({ result, operation, num1: n1, num2: n2 });
});

app.listen(PORT, () => {
  console.log(`Calculator API running at http://localhost:${PORT}`);
});
