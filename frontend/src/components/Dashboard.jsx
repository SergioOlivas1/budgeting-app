import { useState } from "react"

// ─── Fake Data ───────────────────────────────────────────────────────────────
const fakeUser = { display_name: "Sergio", email: "sergio@example.com" }

const fakeSummary = {
  income: 4200.00,
  expenses: 2840.50,
  net: 1359.50,
}

const fakeTransactions = [
  { id: 1, description: "Salary Deposit",     category: "Income",        type: "income",  amount: 4200.00, txn_date: "2026-03-01" },
  { id: 2, description: "Whole Foods",         category: "Groceries",     type: "expense", amount: 134.20, txn_date: "2026-03-03" },
  { id: 3, description: "Netflix",             category: "Subscriptions", type: "expense", amount: 15.99,  txn_date: "2026-03-04" },
  { id: 4, description: "Electric Bill",       category: "Utilities",     type: "expense", amount: 98.00,  txn_date: "2026-03-05" },
  { id: 5, description: "Uber",                category: "Transport",     type: "expense", amount: 22.50,  txn_date: "2026-03-06" },
  { id: 6, description: "Amazon",              category: "Shopping",      type: "expense", amount: 67.99,  txn_date: "2026-03-07" },
  { id: 7, description: "Spotify",             category: "Subscriptions", type: "expense", amount: 9.99,   txn_date: "2026-03-08" },
]

const fakeBudgets = [
  { category: "Groceries",     spent: 134.20, limit: 400.00 },
  { category: "Subscriptions", spent: 25.98,  limit: 50.00  },
  { category: "Utilities",     spent: 98.00,  limit: 150.00 },
  { category: "Transport",     spent: 22.50,  limit: 100.00 },
  { category: "Shopping",      spent: 67.99,  limit: 200.00 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

const categoryColors = {
  Income:        "#22c55e",
  Groceries:     "#3b82f6",
  Subscriptions: "#a855f7",
  Utilities:     "#f97316",
  Transport:     "#06b6d4",
  Shopping:      "#ec4899",
}

const getCategoryColor = (cat) => categoryColors[cat] || "#64748b"

const getProgressColor = (pct) => {
  if (pct >= 100) return "#ef4444"
  if (pct >= 80)  return "#f97316"
  return "#22c55e"
}

// ─── Nav Items ────────────────────────────────────────────────────────────────
const navItems = [
  {
    id: "dashboard", label: "Dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  },
  {
    id: "transactions", label: "Transactions",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  },
  {
    id: "budgets", label: "Budgets",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  },
  {
    id: "settings", label: "Settings",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  },
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard({ user = fakeUser, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div style={styles.shell}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; width: 100%; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        .nav-item:hover { background: rgba(255,255,255,0.05) !important; color: #f1f5f9 !important; }
        .nav-item.active { background: rgba(34,197,94,0.12) !important; color: #22c55e !important; }
        .logout-btn:hover { background: rgba(239,68,68,0.1) !important; color: #ef4444 !important; }
        .collapse-btn:hover { background: rgba(255,255,255,0.08) !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{ ...styles.sidebar, width: sidebarCollapsed ? "72px" : "240px" }}>

        {/* Logo */}
        <div style={styles.sidebarLogo}>
          <div style={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4H9l3-6 3 6h-2v4z" fill="#020817"/>
            </svg>
          </div>
          {!sidebarCollapsed && <span style={styles.logoText}>BudgetWise</span>}
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
              style={{
                ...styles.navItem,
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                color: activePage === item.id ? "#22c55e" : "#64748b",
              }}
              title={sidebarCollapsed ? item.label : ""}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!sidebarCollapsed && <span style={styles.navLabel}>{item.label}</span>}
              {activePage === item.id && <div style={{
                ...styles.navActivePill,
                display: sidebarCollapsed ? "none" : "block"
              }} />}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={styles.sidebarBottom}>
          {/* User */}
          {!sidebarCollapsed && (
            <div style={styles.userCard}>
              <div style={styles.userAvatar}>
                {(user?.display_name || "U")[0].toUpperCase()}
              </div>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user?.display_name || "User"}</span>
                <span style={styles.userEmail}>{user?.email || ""}</span>
              </div>
            </div>
          )}
          {/* Logout */}
          <button
            className="logout-btn"
            onClick={onLogout}
            style={{
              ...styles.logoutBtn,
              justifyContent: sidebarCollapsed ? "center" : "flex-start",
            }}
            title={sidebarCollapsed ? "Logout" : ""}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>

          {/* Collapse toggle */}
          <button
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={styles.collapseBtn}
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
              <path d="M15 18l-6-6 6-6" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={styles.main}>
        {activePage === "dashboard" && <DashboardPage user={user} />}
        {activePage === "transactions" && <PlaceholderPage title="Transactions" icon="💳" />}
        {activePage === "budgets"      && <PlaceholderPage title="Budgets"      icon="📊" />}
        {activePage === "settings"     && <PlaceholderPage title="Settings"     icon="⚙️" />}
      </main>
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage({ user }) {
  const date = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>
            Good morning, {user?.display_name?.split(" ")[0] || "there"} 👋
          </h1>
          <p style={styles.pageSubtitle}>Here's your financial overview for {date}</p>
        </div>
        <div style={styles.dateBadge}>{date}</div>
      </div>

      {/* Summary Cards */}
      <div style={styles.cardsRow}>
        <SummaryCard
          label="Total Income"
          value={fmt(fakeSummary.income)}
          change="+12% from last month"
          positive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
          accent="#22c55e"
        />
        <SummaryCard
          label="Total Expenses"
          value={fmt(fakeSummary.expenses)}
          change="+5% from last month"
          positive={false}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 12V22H4V12" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 7H2v5h20V7z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          accent="#ef4444"
        />
        <SummaryCard
          label="Net Savings"
          value={fmt(fakeSummary.net)}
          change="On track this month"
          positive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          accent="#3b82f6"
        />
      </div>

      {/* Bottom Grid */}
      <div style={styles.bottomGrid}>

        {/* Recent Transactions */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>Recent Transactions</h2>
            <button style={styles.viewAllBtn}>View all →</button>
          </div>
          <div style={styles.txnList}>
            {fakeTransactions.map((txn, i) => (
              <div key={txn.id} style={{
                ...styles.txnRow,
                borderBottom: i < fakeTransactions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                animation: `fadeUp 0.3s ease ${i * 0.05}s both`
              }}>
                <div style={styles.txnLeft}>
                  <div style={{
                    ...styles.txnDot,
                    background: `${getCategoryColor(txn.category)}22`,
                    border: `1px solid ${getCategoryColor(txn.category)}44`,
                  }}>
                    <div style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: getCategoryColor(txn.category),
                    }} />
                  </div>
                  <div>
                    <p style={styles.txnDesc}>{txn.description}</p>
                    <p style={styles.txnMeta}>{txn.category} · {txn.txn_date}</p>
                  </div>
                </div>
                <span style={{
                  ...styles.txnAmount,
                  color: txn.type === "income" ? "#22c55e" : "#f1f5f9"
                }}>
                  {txn.type === "income" ? "+" : "-"}{fmt(txn.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Progress */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>Budget Progress</h2>
            <span style={styles.monthTag}>March 2026</span>
          </div>
          <div style={styles.budgetList}>
            {fakeBudgets.map((b, i) => {
              const pct = Math.min((b.spent / b.limit) * 100, 100)
              const color = getProgressColor(pct)
              return (
                <div key={b.category} style={{
                  ...styles.budgetItem,
                  animation: `fadeUp 0.3s ease ${i * 0.07}s both`
                }}>
                  <div style={styles.budgetTop}>
                    <div style={styles.budgetLeft}>
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: color, flexShrink: 0,
                        boxShadow: `0 0 6px ${color}88`
                      }} />
                      <span style={styles.budgetCategory}>{b.category}</span>
                    </div>
                    <div style={styles.budgetRight}>
                      <span style={{ ...styles.budgetSpent, color }}>
                        {fmt(b.spent)}
                      </span>
                      <span style={styles.budgetLimit}> / {fmt(b.limit)}</span>
                    </div>
                  </div>
                  <div style={styles.progressTrack}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${pct}%`,
                      background: color,
                      boxShadow: `0 0 8px ${color}66`,
                    }} />
                  </div>
                  <div style={styles.budgetMeta}>
                    <span style={{ color: "#475569", fontSize: "11px" }}>
                      {pct >= 100 ? "⚠️ Over budget" : pct >= 80 ? "⚠️ Almost at limit" : `${fmt(b.limit - b.spent)} remaining`}
                    </span>
                    <span style={{ color: "#475569", fontSize: "11px" }}>{Math.round(pct)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ label, value, change, positive, icon, accent }) {
  return (
    <div style={{ ...styles.summaryCard, animation: "fadeUp 0.4s ease both" }}>
      <div style={styles.cardTop}>
        <div style={{ ...styles.cardIconWrap, background: `${accent}14`, border: `1px solid ${accent}22` }}>
          {icon}
        </div>
        <span style={{
          ...styles.cardChange,
          color: positive ? "#22c55e" : "#ef4444",
          background: positive ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
        }}>
          {positive ? "↑" : "↑"} {change}
        </span>
      </div>
      <p style={styles.cardValue}>{value}</p>
      <p style={styles.cardLabel}>{label}</p>
    </div>
  )
}

// ─── Placeholder Page ─────────────────────────────────────────────────────────
function PlaceholderPage({ title, icon }) {
  return (
    <div style={styles.placeholder}>
      <span style={styles.placeholderIcon}>{icon}</span>
      <h2 style={styles.placeholderTitle}>{title}</h2>
      <p style={styles.placeholderText}>This page is coming soon.</p>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  shell: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "#020817",
    fontFamily: "'DM Sans', sans-serif",
    overflow: "hidden",
  },

  // Sidebar
  sidebar: {
    display: "flex",
    flexDirection: "column",
    background: "#080f1e",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    transition: "width 0.3s ease",
    overflow: "hidden",
    flexShrink: 0,
    height: "100vh",
  },
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "24px 20px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    flexShrink: 0,
  },
  logoIcon: {
    width: "34px",
    height: "34px",
    background: "linear-gradient(135deg, #22c55e, #10b981)",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 3px 10px rgba(34,197,94,0.3)",
  },
  logoText: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "17px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.3px",
    whiteSpace: "nowrap",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "16px 10px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.15s ease",
    position: "relative",
    width: "100%",
    textAlign: "left",
  },
  navLabel: {
    whiteSpace: "nowrap",
    flex: 1,
  },
  navActivePill: {
    position: "absolute",
    right: "10px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 6px #22c55e",
  },
  sidebarBottom: {
    padding: "12px 10px 16px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flexShrink: 0,
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    marginBottom: "4px",
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e, #10b981)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    color: "#020817",
    flexShrink: 0,
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
    overflow: "hidden",
  },
  userName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#f1f5f9",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userEmail: {
    fontSize: "11px",
    color: "#475569",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 12px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all 0.15s ease",
    width: "100%",
  },
  collapseBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "7px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    transition: "background 0.15s ease",
    width: "100%",
  },

  // Main
  main: {
    flex: 1,
    overflow: "auto",
    height: "100vh",
    background: "#020817",
  },

  // Page
  page: {
    padding: "36px 40px",
    minHeight: "100%",
    animation: "fadeIn 0.3s ease both",
  },
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "32px",
  },
  pageTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "26px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.4px",
    marginBottom: "4px",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#475569",
  },
  dateBadge: {
    padding: "7px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "500",
    flexShrink: 0,
  },

  // Summary Cards
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  summaryCard: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "22px 24px",
    backdropFilter: "blur(12px)",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  cardIconWrap: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardChange: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "100px",
    letterSpacing: "0.2px",
  },
  cardValue: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "28px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.5px",
    marginBottom: "4px",
  },
  cardLabel: {
    fontSize: "13px",
    color: "#475569",
    fontWeight: "400",
  },

  // Bottom Grid
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  panel: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "24px",
    backdropFilter: "blur(12px)",
    overflow: "hidden",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  panelTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    color: "#f1f5f9",
    letterSpacing: "-0.2px",
  },
  viewAllBtn: {
    background: "none",
    border: "none",
    color: "#22c55e",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    padding: "0",
  },
  monthTag: {
    fontSize: "12px",
    color: "#475569",
    fontWeight: "500",
  },

  // Transactions
  txnList: {
    display: "flex",
    flexDirection: "column",
  },
  txnRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
  },
  txnLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  txnDot: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  txnDesc: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#e2e8f0",
    marginBottom: "2px",
  },
  txnMeta: {
    fontSize: "11px",
    color: "#475569",
  },
  txnAmount: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "14px",
    fontWeight: "600",
  },

  // Budgets
  budgetList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  budgetItem: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  budgetTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  budgetCategory: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#e2e8f0",
  },
  budgetRight: {
    display: "flex",
    alignItems: "baseline",
    gap: "2px",
  },
  budgetSpent: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "13px",
    fontWeight: "600",
  },
  budgetLimit: {
    fontSize: "12px",
    color: "#334155",
  },
  progressTrack: {
    width: "100%",
    height: "5px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "100px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "100px",
    transition: "width 0.6s ease",
  },
  budgetMeta: {
    display: "flex",
    justifyContent: "space-between",
  },

  // Placeholder
  placeholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: "12px",
    animation: "fadeUp 0.4s ease both",
  },
  placeholderIcon: {
    fontSize: "48px",
  },
  placeholderTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "22px",
    fontWeight: "700",
    color: "#f1f5f9",
  },
  placeholderText: {
    fontSize: "14px",
    color: "#475569",
  },
}
