const CATEGORY_COLORS = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c',
  '#4facfe', '#00f2fe', '#43e97b', '#fa709a'
];

const MONTH_LABELS = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

function fmt(amount) {
  return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function fmtDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${MONTH_LABELS[m]} ${parseInt(d)}, ${y}`;
}

function monthLabel(ym) {
  const [, m] = ym.split('-');
  return MONTH_LABELS[m] || ym;
}

// ── KPI Cards ─────────────────────────────────────────────────────────────────
function renderKPIs(stats) {
  document.getElementById('kpiTotal').textContent = fmt(stats.totalExpenses);
  document.getElementById('kpiCount').textContent = stats.totalCount;
  document.getElementById('kpiAvg').textContent = fmt(stats.avgExpense);
  document.getElementById('kpiHighest').textContent = fmt(stats.highestExpense.amount);
  document.getElementById('kpiHighestDesc').textContent = stats.highestExpense.description;
}

// ── Bar Chart – Monthly Spending ──────────────────────────────────────────────
function renderMonthlyChart(monthly) {
  const ctx = document.getElementById('monthlyChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthly.map(m => monthLabel(m.month)),
      datasets: [{
        label: 'Spending ($)',
        data: monthly.map(m => m.total),
        backgroundColor: 'rgba(102, 126, 234, 0.75)',
        borderColor: '#667eea',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + fmt(ctx.parsed.y)
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#6b7280', font: { size: 13 } }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#f3f4f6' },
          ticks: {
            color: '#6b7280',
            font: { size: 12 },
            callback: v => '$' + v
          }
        }
      }
    }
  });
}

// ── Doughnut Chart – Category ─────────────────────────────────────────────────
function renderCategoryChart(byCategory) {
  const ctx = document.getElementById('categoryChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: byCategory.map(c => c.name),
      datasets: [{
        data: byCategory.map(c => c.amount),
        backgroundColor: CATEGORY_COLORS.slice(0, byCategory.length),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#374151',
            padding: 14,
            font: { size: 13 },
            usePointStyle: true,
            pointStyleWidth: 10
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${fmt(ctx.parsed)}`
          }
        }
      }
    }
  });
}

// ── Category List ─────────────────────────────────────────────────────────────
function renderCategoryList(byCategory, total) {
  const list = document.getElementById('categoryList');
  list.innerHTML = '';
  byCategory.forEach((cat, i) => {
    const pct = ((cat.amount / total) * 100).toFixed(1);
    const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
    const li = document.createElement('li');
    li.className = 'category-item';
    li.innerHTML = `
      <div class="cat-header">
        <span class="cat-dot" style="background:${color}"></span>
        <span class="cat-name">${cat.name}</span>
        <span class="cat-amount">${fmt(cat.amount)}</span>
        <span class="cat-pct">${pct}%</span>
      </div>
      <div class="cat-bar-track">
        <div class="cat-bar-fill" style="width:${pct}%;background:${color}"></div>
      </div>
    `;
    list.appendChild(li);
  });
}

// ── Recent Transactions ───────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚗', Entertainment: '🎬',
  Utilities: '⚡', Health: '💊', Shopping: '🛍️', Other: '📦'
};

function renderRecent(recent) {
  const list = document.getElementById('recentList');
  list.innerHTML = '';
  recent.forEach(exp => {
    const icon = CATEGORY_ICONS[exp.category] || '📦';
    const li = document.createElement('li');
    li.className = 'recent-item';
    li.innerHTML = `
      <span class="recent-icon">${icon}</span>
      <div class="recent-info">
        <span class="recent-desc">${exp.description}</span>
        <span class="recent-date">${fmtDate(exp.date)}</span>
      </div>
      <div class="recent-right">
        <span class="recent-amount">${fmt(exp.amount)}</span>
        <span class="recent-cat">${exp.category}</span>
      </div>
    `;
    list.appendChild(li);
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch('/api/stats');
    const stats = await res.json();

    renderKPIs(stats);
    renderMonthlyChart(stats.monthly);
    renderCategoryChart(stats.byCategory);
    renderCategoryList(stats.byCategory, stats.totalExpenses);
    renderRecent(stats.recent);
  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

init();
