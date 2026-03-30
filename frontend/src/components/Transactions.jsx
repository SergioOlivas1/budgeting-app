import { useState, useEffect } from "react"

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

const categoryColors = {
  Income:        "#22c55e",
  Groceries:     "#3b82f6",
  Subscriptions: "#a855f7",
  Utilities:     "#f97316",
  Transport:     "#06b6d4",
  Shopping:      "#ec4899",
  Health:        "#14b8a6",
  Dining:        "#f59e0b",
}
const getColor = (cat) => categoryColors[cat] || "#64748b"

const categories = ["All", "Income", "Groceries", "Subscriptions", "Utilities", "Transport", "Shopping", "Health", "Dining"]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Transactions({ token }) {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch]             = useState("")
  const [filterType, setFilterType]     = useState("All")
  const [filterCategory, setFilterCategory] = useState("All")
  const [sortBy, setSortBy]             = useState("date_desc")
  const [showAddForm, setShowAddForm]   = useState(false)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    if (token) fetchTransactions()
  }, [token])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) setTransactions(data)
    } catch {
      console.error("Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      fetchTransactions()
    } catch {
      console.error("Failed to delete transaction")
    }
  }

  // ── Filter + Search + Sort ──────────────────────────────────────────────────
  const filtered = transactions
    .filter(t => {
      const matchSearch   = t.description.toLowerCase().includes(search.toLowerCase())
      const matchType     = filterType     === "All" || t.type     === filterType.toLowerCase()
      const matchCategory = filterCategory === "All" || t.category === filterCategory
      return matchSearch && matchType && matchCategory
    })
    .sort((a, b) => {
      if (sortBy === "date_desc")   return new Date(b.txn_date) - new Date(a.txn_date)
      if (sortBy === "date_asc")    return new Date(a.txn_date) - new Date(b.txn_date)
      if (sortBy === "amount_desc") return b.amount - a.amount
      if (sortBy === "amount_asc")  return a.amount - b.amount
      return 0
    })

  // ── Summary ──────────────────────────────────────────────────────────────────
  const totalIncome   = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus { outline: none; }
        input::placeholder { color: #334155; }
        .add-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.35) !important; }
        .filter-btn:hover { background: rgba(255,255,255,0.07) !important; }
        .filter-btn.active { background: rgba(34,197,94,0.12) !important; color: #22c55e !important; border-color: rgba(34,197,94,0.3) !important; }
        .delete-btn { opacity: 0; transition: opacity 0.15s; }
        .txn-row:hover .delete-btn { opacity: 1; }
        .txn-row:hover { background: rgba(255,255,255,0.02) !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Transactions</h1>
          <p style={styles.pageSubtitle}>Track and manage your income and expenses</p>
        </div>
        <button
          className="add-btn"
          style={styles.addBtn}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#020817" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Total Income</p>
          <p style={{ ...styles.summaryValue, color: "#22c55e" }}>{fmt(totalIncome)}</p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Total Expenses</p>
          <p style={{ ...styles.summaryValue, color: "#ef4444" }}>{fmt(totalExpenses)}</p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Net</p>
          <p style={{
            ...styles.summaryValue,
            color: totalIncome - totalExpenses >= 0 ? "#22c55e" : "#ef4444"
          }}>
            {fmt(totalIncome - totalExpenses)}
          </p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Transactions</p>
          <p style={styles.summaryValue}>{transactions.length}</p>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <AddTransactionForm
          onClose={() => setShowAddForm(false)}
          token={token}
          onAdded={fetchTransactions}
        />
      )}

      {/* Filters */}
      <div style={styles.filtersRow}>
        {/* Search */}
        <div style={styles.searchWrap}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#475569" strokeWidth="1.5"/>
            <path d="M21 21l-4.35-4.35" stroke="#475569" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Type filter */}
        <div style={styles.filterGroup}>
          {["All", "Income", "Expense"].map(t => (
            <button
              key={t}
              className={`filter-btn ${filterType === t ? "active" : ""}`}
              onClick={() => setFilterType(t)}
              style={styles.filterBtn}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={styles.select}
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="amount_desc">Highest amount</option>
          <option value="amount_asc">Lowest amount</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div style={styles.table}>
        {/* Table Header */}
        <div style={styles.tableHeader}>
          <span style={{ flex: 2 }}>Description</span>
          <span style={{ flex: 1 }}>Category</span>
          <span style={{ flex: 1 }}>Date</span>
          <span style={{ flex: 1, textAlign: "right" }}>Amount</span>
          <span style={{ width: "40px" }} />
        </div>

        {/* Loading */}
        {loading ? (
          <div style={styles.emptyState}>
            <div style={styles.spinner} />
            <p style={styles.emptySubtitle}>Loading transactions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: "32px" }}>🔍</span>
            <p style={styles.emptyTitle}>No transactions found</p>
            <p style={styles.emptySubtitle}>
              {transactions.length === 0
                ? "Add your first transaction using the button above"
                : "Try adjusting your search or filters"
              }
            </p>
          </div>
        ) : (
          filtered.map((txn, i) => (
            <div
              key={txn.id}
              className="txn-row"
              style={{
                ...styles.tableRow,
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                animation: `fadeUp 0.25s ease ${Math.min(i * 0.03, 0.3)}s both`
              }}
            >
              {/* Description */}
              <div style={{ flex: 2, display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "9px", flexShrink: 0,
                  background: `${getColor(txn.category)}18`,
                  border: `1px solid ${getColor(txn.category)}30`,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: getColor(txn.category) }} />
                </div>
                <span style={styles.txnDesc}>{txn.description}</span>
              </div>

              {/* Category */}
              <div style={{ flex: 1 }}>
                <span style={{
                  ...styles.categoryTag,
                  background: `${getColor(txn.category)}14`,
                  color: getColor(txn.category),
                  border: `1px solid ${getColor(txn.category)}28`,
                }}>
                  {txn.category}
                </span>
              </div>

              {/* Date */}
              <span style={{ flex: 1, fontSize: "13px", color: "#64748b" }}>{txn.txn_date}</span>

              {/* Amount */}
              <span style={{
                flex: 1, textAlign: "right",
                fontFamily: "'Sora', sans-serif",
                fontSize: "14px", fontWeight: "600",
                color: txn.type === "income" ? "#22c55e" : "#f1f5f9"
              }}>
                {txn.type === "income" ? "+" : "-"}{fmt(txn.amount)}
              </span>

              {/* Delete */}
              <div style={{ width: "40px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="delete-btn"
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(txn.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Result count */}
      {!loading && filtered.length > 0 && (
        <p style={styles.resultCount}>
          Showing {filtered.length} of {transactions.length} transactions
        </p>
      )}
    </div>
  )
}

// ─── Add Transaction Form ─────────────────────────────────────────────────────
function AddTransactionForm({ onClose, token, onAdded }) {
  const [description, setDescription] = useState("")
  const [amount, setAmount]           = useState("")
  const [type, setType]               = useState("expense")
  const [category, setCategory]       = useState("Groceries")
  const [date, setDate]               = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState("")

  const handleSubmit = async () => {
    if (!description || !amount || !date) {
      setError("Please fill in all fields.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          type,
          category,
          txn_date: date
        })
      })
      if (res.ok) {
        onAdded()
        onClose()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to add transaction")
      }
    } catch {
      setError("Unable to connect. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.formCard}>
      <div style={styles.formHeader}>
        <h3 style={styles.formTitle}>Add Transaction</h3>
        <button onClick={onClose} style={styles.closeBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      <div style={styles.formGrid}>
        <div style={styles.formField}>
          <label style={styles.formLabel}>Description</label>
          <input
            type="text"
            placeholder="e.g. Whole Foods"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formField}>
          <label style={styles.formLabel}>Amount</label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={styles.formInput}
            min="0"
            step="0.01"
          />
        </div>
        <div style={styles.formField}>
          <label style={styles.formLabel}>Type</label>
          <select value={type} onChange={e => setType(e.target.value)} style={styles.formInput}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div style={styles.formField}>
          <label style={styles.formLabel}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={styles.formInput}>
            {categories.filter(c => c !== "All").map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div style={styles.formField}>
          <label style={styles.formLabel}>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Adding..." : "Add Transaction"}
          </button>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    padding: "36px 40px",
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100%",
    color: "#f1f5f9",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
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
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    background: "linear-gradient(135deg, #22c55e, #10b981)",
    border: "none",
    borderRadius: "10px",
    color: "#020817",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(34,197,94,0.25)",
  },
  summaryRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
    marginBottom: "20px",
  },
  summaryCard: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "16px 20px",
  },
  summaryLabel: {
    fontSize: "11px",
    color: "#475569",
    fontWeight: "500",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  summaryValue: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "22px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.3px",
  },
  formCard: {
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "22px 24px",
    marginBottom: "20px",
    animation: "slideIn 0.25s ease both",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  formTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    color: "#f1f5f9",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "10px",
    padding: "10px 14px",
    marginBottom: "16px",
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: "500",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    alignItems: "end",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  formLabel: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#94a3b8",
    letterSpacing: "0.2px",
  },
  formInput: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "9px",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#f1f5f9",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
  },
  submitBtn: {
    flex: 1,
    padding: "10px",
    background: "linear-gradient(135deg, #22c55e, #10b981)",
    border: "none",
    borderRadius: "9px",
    color: "#020817",
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "10px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "9px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  filtersRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "0 14px",
    flex: 1,
    minWidth: "200px",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    padding: "10px 0",
    fontSize: "13px",
    color: "#f1f5f9",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
  },
  filterGroup: {
    display: "flex",
    gap: "6px",
  },
  filterBtn: {
    padding: "8px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  select: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "9px 12px",
    fontSize: "13px",
    color: "#94a3b8",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  table: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    overflow: "hidden",
  },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    padding: "13px 20px",
    background: "rgba(255,255,255,0.02)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "11px",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    transition: "background 0.15s ease",
    cursor: "default",
  },
  txnDesc: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#e2e8f0",
  },
  categoryTag: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "100px",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.2px",
  },
  deleteBtn: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.15)",
    borderRadius: "7px",
    padding: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "10px",
  },
  emptyTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f1f5f9",
  },
  emptySubtitle: {
    fontSize: "13px",
    color: "#475569",
    textAlign: "center",
  },
  spinner: {
    width: "28px",
    height: "28px",
    border: "3px solid rgba(255,255,255,0.06)",
    borderTopColor: "#22c55e",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    marginBottom: "8px",
  },
  resultCount: {
    textAlign: "right",
    fontSize: "12px",
    color: "#334155",
    marginTop: "12px",
  },
}
