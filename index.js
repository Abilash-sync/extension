const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Dashboard endpoints
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get dashboard data
app.get('/api/dashboard', (req, res) => {
  const dashboardData = {
    title: 'Dashboard',
    stats: [
      { label: 'Total Users', value: 1250, icon: 'users' },
      { label: 'Active Sessions', value: 342, icon: 'activity' },
      { label: 'Revenue', value: '$45,230', icon: 'dollar-sign' },
      { label: 'Growth Rate', value: '+12.5%', icon: 'trending-up' }
    ],
    charts: {
      monthly: [
        { month: 'Jan', sales: 4000, users: 2400 },
        { month: 'Feb', sales: 3000, users: 1398 },
        { month: 'Mar', sales: 2000, users: 9800 },
        { month: 'Apr', sales: 2780, users: 3908 },
        { month: 'May', sales: 1890, users: 4800 },
        { month: 'Jun', sales: 2390, users: 3800 }
      ]
    },
    recentActivities: [
      { id: 1, type: 'login', user: 'John Doe', timestamp: new Date().toISOString() },
      { id: 2, type: 'purchase', user: 'Jane Smith', timestamp: new Date().toISOString() },
      { id: 3, type: 'update', user: 'Bob Johnson', timestamp: new Date().toISOString() }
    ]
  };
  res.json(dashboardData);
});

// Get user metrics
app.get('/api/metrics', (req, res) => {
  const metrics = {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    disk: Math.random() * 100,
    network: Math.random() * 100
  };
  res.json(metrics);
});

// Post user feedback
app.post('/api/feedback', (req, res) => {
  const { message, rating } = req.body;
  
  if (!message || !rating) {
    return res.status(400).json({ error: 'Missing required fields: message, rating' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  res.json({ 
    success: true, 
    message: 'Feedback received', 
    data: { message, rating, timestamp: new Date().toISOString() } 
  });
});

app.listen(PORT, () => {
  console.log(`Dashboard API running at http://localhost:${PORT}`);
});
