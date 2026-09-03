/* =====================================================
   DASHBOARD — script.js
   ===================================================== */

/* ── Theme Toggle ─────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const sunIcon  = themeToggle.querySelector('.icon-sun');
const moonIcon = themeToggle.querySelector('.icon-moon');
let darkMode = false;

themeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : '');
  sunIcon.classList.toggle('hidden', darkMode);
  moonIcon.classList.toggle('hidden', !darkMode);
  updateChartThemes();
});

/* ── Sidebar Toggle ───────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const sidebar   = document.getElementById('sidebar');

hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));

document.addEventListener('click', (e) => {
  if (sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

/* ── Nav Active State ─────────────────────────────── */
const navItems      = document.querySelectorAll('.nav-item');
const breadcrumbPage = document.getElementById('breadcrumb-page');

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    breadcrumbPage.textContent = item.dataset.page.charAt(0).toUpperCase() + item.dataset.page.slice(1);
    sidebar.classList.remove('open');
  });
});

/* ── KPI Counter Animation ────────────────────────── */
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const isFloat  = target % 1 !== 0;
  const prefix   = el.textContent.includes('$') ? '$' : '';
  const duration = 1200;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = target * ease;
    const formatted = isFloat
      ? current.toFixed(1)
      : Math.round(current).toLocaleString();
    el.textContent = prefix + formatted + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.querySelectorAll('.kpi-value[data-target]').forEach(el => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(el);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(el);
});

/* ── Sparkline Helper ─────────────────────────────── */
function createSparkline(containerId, data, color) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const canvas = document.createElement('canvas');
  canvas.height = 36;
  container.appendChild(canvas);

  return new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data,
        borderColor: color,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
        backgroundColor: (ctx) => {
          const grad = ctx.chart.ctx.createLinearGradient(0, 0, 0, 36);
          grad.addColorStop(0, color + '44');
          grad.addColorStop(1, color + '00');
          return grad;
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      animation: { duration: 1000 }
    }
  });
}

createSparkline('spark1', [30,42,38,55,47,60,58,72,68,80,75,84], '#6366f1');
createSparkline('spark2', [60,55,72,68,80,75,88,82,92,88,96,93], '#10b981');
createSparkline('spark3', [20,28,24,35,30,42,38,48,44,52,50,58], '#f59e0b');
createSparkline('spark4', [2.1,1.9,2.3,2.0,2.5,2.2,2.6,2.3,2.5,2.2,2.4,2.4], '#ef4444');

/* ── Revenue Chart ────────────────────────────────── */
const monthlyData = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  revenue:  [42000,48000,45000,52000,58000,61000,55000,63000,70000,68000,74000,84320],
  expenses: [28000,31000,29000,34000,36000,38000,33000,39000,43000,41000,46000,51000]
};

const weeklyData = {
  labels: ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'],
  revenue:  [9800,11200,10400,12000,13400,14100,12700,14600,16200,15700,17100,19500],
  expenses: [6200,7100,6700,7800,8300,8800,7600,9000,9900,9500,10600,11800]
};

let revenueChart;

function getChartColors() {
  return darkMode
    ? { grid: 'rgba(255,255,255,0.06)', text: '#94a3b8' }
    : { grid: 'rgba(0,0,0,0.05)',       text: '#9ca3af' };
}

function buildRevenueChart(dataSet) {
  const { grid, text } = getChartColors();
  const ctx = document.getElementById('revenueChart').getContext('2d');

  const gradRev = ctx.createLinearGradient(0, 0, 0, 260);
  gradRev.addColorStop(0, 'rgba(99,102,241,.22)');
  gradRev.addColorStop(1, 'rgba(99,102,241,0)');

  const gradExp = ctx.createLinearGradient(0, 0, 0, 260);
  gradExp.addColorStop(0, 'rgba(16,185,129,.18)');
  gradExp.addColorStop(1, 'rgba(16,185,129,0)');

  if (revenueChart) revenueChart.destroy();

  revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataSet.labels,
      datasets: [
        {
          label: 'Revenue',
          data: dataSet.revenue,
          borderColor: '#6366f1',
          backgroundColor: gradRev,
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#6366f1',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Expenses',
          data: dataSet.expenses,
          borderColor: '#10b981',
          backgroundColor: gradExp,
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#10b981',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.6,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { color: text, usePointStyle: true, pointStyleWidth: 8, boxHeight: 6, font: { size: 12 } }
        },
        tooltip: {
          backgroundColor: darkMode ? '#1a1d27' : '#1f2937',
          titleColor: '#f9fafb',
          bodyColor: '#d1d5db',
          padding: 12,
          borderWidth: 0,
          callbacks: {
            label: ctx => ` $${ctx.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: grid, drawBorder: false },
          ticks: { color: text, font: { size: 11 } }
        },
        y: {
          grid: { color: grid, drawBorder: false },
          ticks: {
            color: text,
            font: { size: 11 },
            callback: v => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
          }
        }
      }
    }
  });
}

buildRevenueChart(monthlyData);

window.switchRevChart = function(type, btn) {
  document.querySelectorAll('.chart-actions .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  buildRevenueChart(type === 'monthly' ? monthlyData : weeklyData);
};

/* ── Donut Chart ──────────────────────────────────── */
const donutSources = [
  { label: 'Organic Search', pct: 38, color: '#6366f1' },
  { label: 'Direct',         pct: 24, color: '#10b981' },
  { label: 'Social Media',   pct: 20, color: '#f59e0b' },
  { label: 'Referral',       pct: 12, color: '#3b82f6' },
  { label: 'Other',          pct:  6, color: '#e5e7eb' }
];

let donutChart;

function buildDonutChart() {
  const ctx = document.getElementById('donutChart').getContext('2d');
  if (donutChart) donutChart.destroy();

  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: donutSources.map(s => s.label),
      datasets: [{
        data: donutSources.map(s => s.pct),
        backgroundColor: donutSources.map(s => s.color),
        hoverOffset: 6,
        borderWidth: 3,
        borderColor: darkMode ? '#1a1d27' : '#ffffff'
      }]
    },
    options: {
      responsive: true,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: darkMode ? '#1a1d27' : '#1f2937',
          titleColor: '#f9fafb',
          bodyColor: '#d1d5db',
          padding: 10,
          callbacks: { label: ctx => ` ${ctx.parsed}%` }
        }
      }
    }
  });

  const legend = document.getElementById('donutLegend');
  legend.innerHTML = donutSources.map(s => `
    <div class="legend-item">
      <div class="legend-left">
        <div class="legend-dot" style="background:${s.color}"></div>
        <span>${s.label}</span>
      </div>
      <span class="legend-pct">${s.pct}%</span>
    </div>`).join('');
}

buildDonutChart();

/* ── Transactions Table ───────────────────────────── */
const txData = [
  { name: 'Alice Johnson',  email: 'alice@email.com',  product: 'Pro Plan',      amount: '$299.00', status: 'paid',    color: '#6366f1' },
  { name: 'Bob Martinez',   email: 'bob@email.com',    product: 'Starter Pack',  amount: '$49.00',  status: 'pending', color: '#10b981' },
  { name: 'Carol White',    email: 'carol@email.com',  product: 'Enterprise',    amount: '$999.00', status: 'paid',    color: '#f59e0b' },
  { name: 'David Kim',      email: 'david@email.com',  product: 'Pro Plan',      amount: '$299.00', status: 'failed',  color: '#ef4444' },
  { name: 'Eva Brown',      email: 'eva@email.com',    product: 'Growth Bundle', amount: '$149.00', status: 'paid',    color: '#3b82f6' },
  { name: 'Frank Lee',      email: 'frank@email.com',  product: 'Starter Pack',  amount: '$49.00',  status: 'pending', color: '#8b5cf6' },
];

const tbody = document.getElementById('txTable');
tbody.innerHTML = txData.map(tx => `
  <tr>
    <td>
      <div class="customer-cell">
        <div class="cust-avatar" style="background:${tx.color}">${tx.name.split(' ').map(n=>n[0]).join('')}</div>
        <div>
          <div class="cust-name">${tx.name}</div>
          <div class="cust-email">${tx.email}</div>
        </div>
      </div>
    </td>
    <td>${tx.product}</td>
    <td style="font-weight:600">${tx.amount}</td>
    <td><span class="status-pill ${tx.status}">${tx.status.charAt(0).toUpperCase()+tx.status.slice(1)}</span></td>
  </tr>`).join('');

/* ── Top Products ─────────────────────────────────── */
const products = [
  { name: 'Pro Plan',      pct: 84, color: '#6366f1' },
  { name: 'Enterprise',    pct: 63, color: '#10b981' },
  { name: 'Growth Bundle', pct: 48, color: '#f59e0b' },
  { name: 'Starter Pack',  pct: 31, color: '#3b82f6' },
];

const productList = document.getElementById('productList');
productList.innerHTML = products.map((p, i) => `
  <div class="product-item">
    <div class="product-rank">${i + 1}</div>
    <div class="product-info">
      <div class="product-name">${p.name}</div>
      <div class="product-bar-wrap">
        <div class="product-bar" style="width:0%; background:${p.color}" data-pct="${p.pct}"></div>
      </div>
    </div>
    <div class="product-pct">${p.pct}%</div>
  </div>`).join('');

// Animate bars on load
setTimeout(() => {
  document.querySelectorAll('.product-bar').forEach(bar => {
    bar.style.width = bar.dataset.pct + '%';
  });
}, 200);

/* ── Activity Feed ────────────────────────────────── */
const activities = [
  { text: '<strong>Alice Johnson</strong> upgraded to Enterprise plan', time: '2m ago',  color: '#6366f1' },
  { text: 'New user <strong>Frank Lee</strong> signed up',              time: '15m ago', color: '#10b981' },
  { text: '<strong>Payment failed</strong> for David Kim — retrying',  time: '1h ago',  color: '#ef4444' },
  { text: '<strong>Carol White</strong> opened a support ticket',       time: '3h ago',  color: '#f59e0b' },
  { text: 'Monthly report for <strong>November</strong> is ready',      time: '5h ago',  color: '#3b82f6' },
];

const activityList = document.getElementById('activityList');
activityList.innerHTML = activities.map(a => `
  <li class="activity-item">
    <div class="activity-dot" style="background:${a.color}"></div>
    <div class="activity-text">${a.text}</div>
    <div class="activity-time">${a.time}</div>
  </li>`).join('');

/* ── Live Clock in Topbar ─────────────────────────── */
// (subtle – updates activity timestamps conceptually)

/* ── Update all charts when theme changes ─────────── */
function updateChartThemes() {
  buildRevenueChart(
    document.querySelector('.chart-actions .chip.active').textContent.trim() === 'Monthly'
      ? monthlyData
      : weeklyData
  );
  buildDonutChart();
}
