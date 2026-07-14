const { useState, useEffect } = React;

// ─── Data ─────────────────────────────────────────────────────────────────
const navItems = [
  { icon: "📊", label: "Overview", badge: null, section: "main" },
  { icon: "📈", label: "Analytics", badge: null, section: "main" },
  { icon: "💳", label: "Transactions", badge: "12", section: "main" },
  { icon: "👥", label: "Customers", badge: null, section: "main" },
  { icon: "📦", label: "Products", badge: null, section: "main" },
  { icon: "🎯", label: "Campaigns", badge: "3", section: "manage" },
  { icon: "📅", label: "Calendar", badge: null, section: "manage" },
  { icon: "📝", label: "Reports", badge: null, section: "manage" },
  { icon: "⚙️", label: "Settings", badge: null, section: "system" },
  { icon: "🔔", label: "Notifications", badge: "5", section: "system" },
];

const statsData = [
  {
    icon: "💰", label: "Total Revenue", value: "$128,430",
    badge: "+18.4%", badgeType: "up",
    sub: "vs last month: $108,500",
    accent: "linear-gradient(135deg,#4f8ef7,#9b6dff)",
    iconBg: "rgba(79,142,247,0.15)",
    spark: [40, 60, 45, 80, 65, 90, 75, 100, 85, 110, 95, 128],
  },
  {
    icon: "🛒", label: "Orders", value: "3,842",
    badge: "+9.2%", badgeType: "up",
    sub: "Avg order: $33.42",
    accent: "linear-gradient(135deg,#2dd4a0,#4f8ef7)",
    iconBg: "rgba(45,212,160,0.15)",
    spark: [30, 50, 40, 60, 55, 70, 65, 80, 75, 85, 78, 95],
  },
  {
    icon: "👤", label: "New Users", value: "1,294",
    badge: "+5.7%", badgeType: "up",
    sub: "Churn rate: 2.1%",
    accent: "linear-gradient(135deg,#9b6dff,#f472b6)",
    iconBg: "rgba(155,109,255,0.15)",
    spark: [20, 35, 28, 48, 42, 58, 52, 65, 60, 72, 68, 80],
  },
  {
    icon: "🔄", label: "Refund Rate", value: "1.8%",
    badge: "-0.4%", badgeType: "down",
    sub: "56 refunds this month",
    accent: "linear-gradient(135deg,#ff8c42,#f472b6)",
    iconBg: "rgba(255,140,66,0.15)",
    spark: [15, 18, 22, 19, 25, 21, 18, 16, 20, 17, 15, 18],
  },
];

const barData = {
  "7D":  { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], revenue: [62,78,55,90,73,95,84], orders: [40,52,38,68,54,70,62] },
  "1M":  { labels: ["W1","W2","W3","W4"], revenue: [240,310,280,360], orders: [180,240,210,290] },
  "6M":  { labels: ["Jan","Feb","Mar","Apr","May","Jun"], revenue: [520,640,590,780,720,850], orders: [380,460,420,590,540,660] },
  "1Y":  { labels: ["Q1","Q2","Q3","Q4"], revenue: [1800,2200,2050,2600], orders: [1300,1700,1580,2000] },
};

const donutData = [
  { label: "Direct",    value: 42, color: "#4f8ef7" },
  { label: "Organic",   value: 28, color: "#2dd4a0" },
  { label: "Referral",  value: 18, color: "#9b6dff" },
  { label: "Social",    value: 12, color: "#ff8c42" },
];

const transactions = [
  { id: "#TXN-8821", name: "Spotify Premium", cat: "Subscription", catColor: "#4f8ef7", catBg: "rgba(79,142,247,0.1)", amount: "-$9.99", type: "neg", status: "success", date: "Today 2:34 PM" },
  { id: "#TXN-8820", name: "Client Invoice #042", cat: "Income", catColor: "#2dd4a0", catBg: "rgba(45,212,160,0.1)", amount: "+$4,200.00", type: "pos", status: "success", date: "Today 11:10 AM" },
  { id: "#TXN-8818", name: "AWS Services", cat: "Cloud", catColor: "#9b6dff", catBg: "rgba(155,109,255,0.1)", amount: "-$142.50", type: "neg", status: "success", date: "Yesterday" },
  { id: "#TXN-8817", name: "Freelance Design", cat: "Income", catColor: "#2dd4a0", catBg: "rgba(45,212,160,0.1)", amount: "+$850.00", type: "pos", status: "pending", date: "Yesterday" },
  { id: "#TXN-8816", name: "Office Supplies", cat: "Expenses", catColor: "#ff8c42", catBg: "rgba(255,140,66,0.1)", amount: "-$67.20", type: "neg", status: "failed", date: "Jul 14" },
  { id: "#TXN-8815", name: "SaaS License", cat: "Subscription", catColor: "#4f8ef7", catBg: "rgba(79,142,247,0.1)", amount: "-$299.00", type: "neg", status: "success", date: "Jul 13" },
];

const activities = [
  { dot: "#4f8ef7", msg: <><span>Sarah K.</span> completed order #9920 — $340.00</>, time: "2 min ago" },
  { dot: "#2dd4a0", msg: <><span>New user</span> registered via Google OAuth</>, time: "14 min ago" },
  { dot: "#9b6dff", msg: <><span>Campaign #12</span> reached 10k impressions</>, time: "1 hr ago" },
  { dot: "#ff8c42", msg: <><span>Payment failed</span> for order #8816 — retrying…</>, time: "2 hr ago" },
  { dot: "#f472b6", msg: <><span>Report Q2-2025</span> generated and exported</>, time: "4 hr ago" },
];

const goals = [
  { name: "Monthly Revenue", pct: 78, color: "linear-gradient(90deg,#4f8ef7,#9b6dff)" },
  { name: "User Acquisition", pct: 63, color: "linear-gradient(90deg,#2dd4a0,#4f8ef7)" },
  { name: "Order Volume", pct: 91, color: "linear-gradient(90deg,#9b6dff,#f472b6)" },
  { name: "Support Tickets Resolved", pct: 55, color: "linear-gradient(90deg,#ff8c42,#f472b6)" },
];

// ─── Donut SVG ─────────────────────────────────────────────────────────────
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 70, cy = 70, r = 55, stroke = 22;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const slices = data.map(d => {
    const dash = (d.value / total) * circumference;
    const gap = circumference - dash;
    const slice = { ...d, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="donut-wrap">
      <svg className="donut-svg" width="140" height="140" viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1d27" strokeWidth={stroke} />
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset + circumference * 0.25}
            style={{ transition: "all 0.5s ease" }}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#e8eaf0" fontSize="20" fontWeight="800" fontFamily="Inter">
          {total}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#8890a8" fontSize="10" fontFamily="Inter">
          Coverage
        </text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div className="legend-item" key={i}>
            <span className="legend-dot" style={{ background: d.color }} />
            <span className="legend-text">{d.label}</span>
            <span className="legend-val" style={{ marginLeft: 16 }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bar Chart ─────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const maxVal = Math.max(...data.revenue, ...data.orders);
  return (
    <div className="bar-chart">
      {data.labels.map((lbl, i) => {
        const h1 = (data.revenue[i] / maxVal) * 120;
        const h2 = (data.orders[i] / maxVal) * 120;
        return (
          <div className="bar-group" key={i}>
            <div className="bars">
              <div className="bar" style={{ height: h1, background: "linear-gradient(180deg,#4f8ef7,#9b6dff)" }} title={`Revenue: ${data.revenue[i]}`} />
              <div className="bar" style={{ height: h2, background: "linear-gradient(180deg,#2dd4a0,rgba(45,212,160,0.3))" }} title={`Orders: ${data.orders[i]}`} />
            </div>
            <span className="bar-label">{lbl}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Sparkline ─────────────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  const max = Math.max(...data);
  return (
    <div className="sparkline">
      {data.map((v, i) => (
        <div key={i} className="spark-bar"
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: i === data.length - 1 ? 1 : 0.5 + 0.5 * (i / data.length) }}
        />
      ))}
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
function App() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeTab, setActiveTab] = useState("7D");
  const [searchVal, setSearchVal] = useState("");

  const sections = ["main", "manage", "system"];
  const sectionLabels = { main: "Main Menu", manage: "Manage", system: "System" };

  return (
    <div className="app">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">Dash<span>Pro</span></span>
        </div>
        <nav className="sidebar-nav">
          {sections.map(sec => {
            const items = navItems.filter(n => n.section === sec);
            return (
              <div key={sec}>
                <div className="nav-section-title">{sectionLabels[sec]}</div>
                {items.map(item => (
                  <div
                    key={item.label}
                    className={`nav-item${activeNav === item.label ? " active" : ""}`}
                    onClick={() => setActiveNav(item.label)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </div>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">AJ</div>
            <div className="user-info">
              <div className="user-name">Alex Johnson</div>
              <div className="user-role">Admin · Pro Plan</div>
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: 16 }}>⋯</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">{activeNav}</span>
            <span className="topbar-sub">📅 Wednesday, July 16 2025</span>
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <span style={{ color: "var(--text-muted)" }}>🔍</span>
              <input
                placeholder="Search anything…"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
            </div>
            <div className="icon-btn">
              🔔
              <span className="notif-dot" />
            </div>
            <div className="icon-btn">🌙</div>
            <div className="user-avatar" style={{ width: 36, height: 36, borderRadius: 10, fontSize: 14 }}>AJ</div>
          </div>
        </header>

        {/* Content */}
        <div className="content">

          {/* ── Stat Cards ── */}
          <div className="stats-grid">
            {statsData.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-card-accent" style={{ background: s.accent }} />
                <div className="stat-card-top">
                  <div className="stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                  <div className={`stat-badge ${s.badgeType}`}>
                    {s.badgeType === "up" ? "▲" : "▼"} {s.badge}
                  </div>
                </div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <Sparkline data={s.spark} color={s.accent.includes("4f8ef7") ? "#4f8ef7" : s.accent.includes("2dd4a0") ? "#2dd4a0" : s.accent.includes("9b6dff") ? "#9b6dff" : "#ff8c42"} />
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Mid Row ── */}
          <div className="mid-row">
            {/* Revenue Chart */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Revenue & Orders</div>
                  <div className="card-sub">
                    <span style={{ color: "#4f8ef7", fontWeight: 600 }}>━ Revenue</span>
                    {" "}
                    <span style={{ color: "#2dd4a0", fontWeight: 600 }}>━ Orders</span>
                  </div>
                </div>
                <div className="tab-group">
                  {["7D", "1M", "6M", "1Y"].map(t => (
                    <div key={t} className={`tab${activeTab === t ? " active" : ""}`}
                      onClick={() => setActiveTab(t)}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <BarChart data={barData[activeTab]} />
            </div>

            {/* Traffic Sources */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Traffic Sources</div>
                  <div className="card-sub">Acquisition breakdown</div>
                </div>
              </div>
              <DonutChart data={donutData} />
            </div>
          </div>

          {/* ── Bottom Row ── */}
          <div className="bottom-row">
            {/* Transactions */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Recent Transactions</div>
                  <div className="card-sub">Last 6 transactions</div>
                </div>
                <div className="tab" style={{ background: "rgba(79,142,247,0.1)", color: "#4f8ef7", cursor: "pointer", borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 600 }}>
                  View All
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={i}>
                      <td>
                        <div className="tx-name">{tx.name}</div>
                        <div className="tx-id">{tx.id}</div>
                      </td>
                      <td>
                        <span className="tx-cat" style={{ background: tx.catBg, color: tx.catColor }}>
                          {tx.cat}
                        </span>
                      </td>
                      <td><span className={`tx-amount ${tx.type}`}>{tx.amount}</span></td>
                      <td>
                        <span className={`status-badge ${tx.status}`}>
                          {tx.status === "success" ? "✓" : tx.status === "pending" ? "⏳" : "✕"} {tx.status}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Goals */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Monthly Goals</div>
                    <div className="card-sub">Progress vs target</div>
                  </div>
                </div>
                {goals.map((g, i) => (
                  <div className="goal-item" key={i}>
                    <div className="goal-header">
                      <span className="goal-name">{g.name}</span>
                      <span className="goal-pct" style={{ color: g.pct >= 80 ? "#2dd4a0" : g.pct >= 60 ? "#4f8ef7" : "#ff8c42" }}>
                        {g.pct}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${g.pct}%`, background: g.color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Live Activity</div>
                    <div className="card-sub">Real-time updates</div>
                  </div>
                  <span style={{ fontSize: 11, background: "rgba(45,212,160,0.1)", color: "#2dd4a0", borderRadius: 20, padding: "3px 9px", fontWeight: 600 }}>
                    ● Live
                  </span>
                </div>
                <div className="activity-list">
                  {activities.map((a, i) => (
                    <div className="activity-item" key={i}>
                      <div className="activity-dot-wrap">
                        <div className="activity-dot" style={{ background: a.dot }} />
                        <div className="activity-line" />
                      </div>
                      <div className="activity-content">
                        <div className="activity-msg">{a.msg}</div>
                        <div className="activity-time">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
