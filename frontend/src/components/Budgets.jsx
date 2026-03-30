import { useState, useEffect } from "react"

const availableCategories = [
  "Groceries", "Subscriptions", "Utilities", "Transport",
  "Shopping", "Dining", "Health", "Entertainment", "Education", "Other"
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

const getProgressColor = (pct) => {
  if (pct >= 100) return "#ef4444"
  if (pct >= 80)  return "#f97316"
  if (pct >= 60)  return "#eab308"
  return "#22c55e"
}

const getStatusInfo = (pct) => {
  if (pct >= 100) return { label: "Over budget",      icon: "🔴", color: "#ef4444" }
  if (pct >= 80)  return { label: "Almost at limit",  icon: "⚠️", color: "#f97316" }
  if (pct >= 60)  return { label: "On track",         icon: "🟡", color: "#eab308" }
  return             { label: "Good",               icon: "✅", color: "#22c55e" }
}

const categoryColors = {
  Groceries:     "#3b82f6",
  Subscriptions: "#a855f7",
  Utilities:     "#f97316",
  Transport:     "#06b6d4",
  Shopping:      "#ec4899",
  Dining:        "#f59e0b",
  Health:        "#14b8a6",
  Entertainment: "#8b5cf6",
  Education:     "#10b981",
  Other:         "#64748b",
}
const getCategoryColor = (cat) => categoryColors[cat] || "#64748b"

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Budgets({ token }) {
  const [budgets, setBudgets]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editBudget, setEditBudget] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const totalLimit   = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent   = budgets.reduce((s, b) => s + b.spent, 0)
  const overBudget   = budgets.filter(b => b.spent >= b.limit).length
  const onTrack      = budgets.filter(b => b.spent < b.limit * 0.8).length

  useEffect(() => {
  if (token) fetchBudgets()
}, [token])

const fetchBudgets = async () => {
  setLoading(true)
  try {
    const res  = await fetch("http://127.0.0.1:5000/api/budgets", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    const data = await res.json()
    if (Array.isArray(data)) setBudgets(data)
  } catch {
    console.error("Failed to fetch budgets")
  } finally {
    setLoading(false)
  }
}

const handleSave = async (data) => {
  try {
    if (editBudget) {
      await fetch(`http://127.0.0.1:5000/api/budgets/${editBudget.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ limit: data.limit })
      })
    } else {
      await fetch("http://127.0.0.1:5000/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
    }
    fetchBudgets()
    setShowModal(false)
    setEditBudget(null)
  } catch {
    console.error("Failed to save budget")
  }
}

const handleDelete = async (id) => {
  try {
    await fetch(`http://127.0.0.1:5000/api/budgets/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    fetchBudgets()
    setDeleteConfirm(null)
  } catch {
    console.error("Failed to delete budget")
  }
}

  const handleEdit = (budget) => {
    setEditBudget(budget)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditBudget(null)
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .add-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.35) !important; }
        .budget-card:hover { border-color: rgba(255,255,255,0.12) !important; transform: translateY(-1px); }
        .action-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .delete-btn:hover { background: rgba(239,68,68,0.12) !important; color: #ef4444 !important; }
        .modal-overlay { animation: fadeIn 0.2s ease both; }
        .modal-card { animation: scaleIn 0.2s ease both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fillBar { from { width: 0; } to { } }
        input:focus, select:focus { outline: none; border-color: rgba(34,197,94,0.5) !important; box-shadow: 0 0 0 3px rgba(34,197,94,0.08) !important; }
        input::placeholder { color: #334155; }
      `}</style>

      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Budgets</h1>
          <p style={styles.pageSubtitle}>Set limits and track your spending by category</p>
        </div>
        <button
          className="add-btn"
          style={styles.addBtn}
          onClick={() => setShowModal(true)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#020817" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Add Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Total Budget</p>
          <p style={styles.summaryValue}>{fmt(totalLimit)}</p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Total Spent</p>
          <p style={{ ...styles.summaryValue, color: totalSpent > totalLimit ? "#ef4444" : "#f1f5f9" }}>
            {fmt(totalSpent)}
          </p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Remaining</p>
          <p style={{ ...styles.summaryValue, color: totalLimit - totalSpent >= 0 ? "#22c55e" : "#ef4444" }}>
            {fmt(Math.max(totalLimit - totalSpent, 0))}
          </p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Over Budget</p>
          <p style={{ ...styles.summaryValue, color: overBudget > 0 ? "#ef4444" : "#22c55e" }}>
            {overBudget} {overBudget === 1 ? "category" : "categories"}
          </p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>On Track</p>
          <p style={{ ...styles.summaryValue, color: "#22c55e" }}>
            {onTrack} {onTrack === 1 ? "category" : "categories"}
          </p>
        </div>
      </div>

      {/* Month label */}
      <div style={styles.monthRow}>
        <h2 style={styles.monthTitle}>
          March 2026
        </h2>
        <span style={styles.budgetCount}>{budgets.length} budget{budgets.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Budget Cards Grid */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
          <div style={{
            width: "28px", height: "28px",
            border: "3px solid rgba(255,255,255,0.06)",
            borderTopColor: "#22c55e",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite"
          }} />
        </div>
      ) : (
        <div style={styles.cardsGrid}>
        {budgets.map((budget, i) => {
          const pct    = (budget.spent / budget.limit) * 100
          const color  = getProgressColor(pct)
          const status = getStatusInfo(pct)
          const catColor = getCategoryColor(budget.category)

          return (
            <div
              key={budget.id}
              className="budget-card"
              style={{
                ...styles.budgetCard,
                animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
                borderTop: `3px solid ${catColor}`,
              }}
            >
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={styles.cardLeft}>
                  <div style={{
                    ...styles.categoryDot,
                    background: `${catColor}18`,
                    border: `1px solid ${catColor}30`,
                  }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: catColor }} />
                  </div>
                  <span style={styles.categoryName}>{budget.category}</span>
                </div>
                <div style={styles.cardActions}>
                  <button
                    className="action-btn"
                    style={styles.actionBtn}
                    onClick={() => handleEdit(budget)}
                    title="Edit"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="delete-btn action-btn"
                    style={styles.actionBtn}
                    onClick={() => setDeleteConfirm(budget.id)}
                    title="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Amounts */}
              <div style={styles.amountsRow}>
                <div>
                  <p style={styles.spentAmount}>{fmt(budget.spent)}</p>
                  <p style={styles.spentLabel}>spent</p>
                </div>
                <div style={styles.amountDivider} />
                <div style={{ textAlign: "right" }}>
                  <p style={styles.limitAmount}>{fmt(budget.limit)}</p>
                  <p style={styles.limitLabel}>limit</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={styles.progressTrack}>
                <div style={{
                  ...styles.progressFill,
                  width: `${Math.min(pct, 100)}%`,
                  background: color,
                  boxShadow: `0 0 8px ${color}55`,
                  animation: "fillBar 0.8s ease both",
                }} />
              </div>

              {/* Footer */}
              <div style={styles.cardFooter}>
                <span style={{ ...styles.statusLabel, color: status.color }}>
                  {status.icon} {status.label}
                </span>
                <span style={{ ...styles.pctLabel, color }}>
                  {Math.round(pct)}%
                </span>
              </div>

              {/* Remaining */}
              <div style={{
                ...styles.remainingBar,
                background: pct >= 100 ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.04)",
                border: pct >= 100 ? "1px solid rgba(239,68,68,0.12)" : "1px solid rgba(34,197,94,0.08)",
              }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  {pct >= 100
                    ? `${fmt(budget.spent - budget.limit)} over budget`
                    : `${fmt(budget.limit - budget.spent)} remaining`
                  }
                </span>
              </div>

              {/* Delete Confirm */}
              {deleteConfirm === budget.id && (
                <div style={styles.deleteConfirm}>
                  <p style={styles.deleteConfirmText}>Delete this budget?</p>
                  <div style={styles.deleteConfirmBtns}>
                    <button
                      style={styles.confirmDeleteBtn}
                      onClick={() => handleDelete(budget.id)}
                    >
                      Delete
                    </button>
                    <button
                      style={styles.cancelDeleteBtn}
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Add New Budget Card */}
        <div
          style={styles.addCard}
          onClick={() => setShowModal(true)}
        >
          <div style={styles.addCardIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#475569" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={styles.addCardText}>Add new budget</p>
        </div>
      </div>
      )}

      {/* Modal */}
      {showModal && (
        <BudgetModal
          budget={editBudget}
          onSave={handleSave}
          onClose={handleCloseModal}
          existingCategories={budgets.map(b => b.category)}
        />
      )}
    </div>
  )
}

// ─── Budget Modal ─────────────────────────────────────────────────────────────
function BudgetModal({ budget, onSave, onClose, existingCategories }) {
  const [category, setCategory] = useState(budget?.category || "")
  const [limit, setLimit]       = useState(budget?.limit || "")
  const [error, setError]       = useState("")

  const isEdit = !!budget

  const handleSave = () => {
    if (!category) { setError("Please select a category."); return }
    if (!limit || isNaN(limit) || parseFloat(limit) <= 0) { setError("Please enter a valid limit amount."); return }
    if (!isEdit && existingCategories.includes(category)) { setError("A budget for this category already exists."); return }
    onSave({ category, limit: parseFloat(limit) })
  }

  const available = availableCategories.filter(c => !existingCategories.includes(c) || c === budget?.category)

  return (
    <div className="modal-overlay" style={styles.modalOverlay} onClick={onClose}>
      <div className="modal-card" style={styles.modalCard} onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{isEdit ? "Edit Budget" : "Add New Budget"}</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <div style={styles.modalForm}>
          {/* Category */}
          <div style={styles.formField}>
            <label style={styles.formLabel}>Category</label>
            <select
              value={category}
              onChange={e => { setCategory(e.target.value); setError("") }}
              style={styles.formInput}
              disabled={isEdit}
            >
              <option value="">Select a category...</option>
              {available.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {isEdit && <p style={styles.formHint}>Category cannot be changed when editing.</p>}
          </div>

          {/* Limit */}
          <div style={styles.formField}>
            <label style={styles.formLabel}>Monthly Limit</label>
            <div style={styles.inputWithPrefix}>
              <span style={styles.inputPrefix}>$</span>
              <input
                type="number"
                placeholder="0.00"
                value={limit}
                onChange={e => { setLimit(e.target.value); setError("") }}
                style={{ ...styles.formInput, paddingLeft: "32px" }}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Preview */}
          {limit && parseFloat(limit) > 0 && (
            <div style={styles.preview}>
              <p style={styles.previewLabel}>Preview</p>
              <div style={styles.previewBar}>
                <div style={{ ...styles.previewFill, width: "0%" }} />
              </div>
              <div style={styles.previewFooter}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>$0.00 spent</span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{fmt(parseFloat(limit))} limit</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSave} style={styles.saveBtn}>
            {isEdit ? "Save Changes" : "Add Budget"}
          </button>
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
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "14px",
    marginBottom: "28px",
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
    fontSize: "20px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.3px",
  },
  monthRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  monthTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "16px",
    fontWeight: "600",
    color: "#f1f5f9",
  },
  budgetCount: {
    fontSize: "13px",
    color: "#475569",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  budgetCard: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "20px",
    transition: "all 0.2s ease",
    cursor: "default",
    position: "relative",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  cardLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  categoryDot: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#f1f5f9",
    fontFamily: "'Sora', sans-serif",
  },
  cardActions: {
    display: "flex",
    gap: "6px",
  },
  actionBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    border: "none",
    background: "rgba(255,255,255,0.04)",
    color: "#64748b",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
  },
  amountsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  spentAmount: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "22px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.3px",
    marginBottom: "2px",
  },
  spentLabel: {
    fontSize: "11px",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  amountDivider: {
    width: "1px",
    height: "36px",
    background: "rgba(255,255,255,0.07)",
  },
  limitAmount: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "22px",
    fontWeight: "700",
    color: "#475569",
    letterSpacing: "-0.3px",
    marginBottom: "2px",
  },
  limitLabel: {
    fontSize: "11px",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    textAlign: "right",
  },
  progressTrack: {
    width: "100%",
    height: "6px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "100px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "100px",
    transition: "width 0.6s ease",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  statusLabel: {
    fontSize: "12px",
    fontWeight: "500",
  },
  pctLabel: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "13px",
    fontWeight: "700",
  },
  remainingBar: {
    borderRadius: "8px",
    padding: "7px 10px",
    textAlign: "center",
  },
  deleteConfirm: {
    position: "absolute",
    inset: 0,
    background: "rgba(8,15,30,0.95)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    padding: "20px",
  },
  deleteConfirmText: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#f1f5f9",
    textAlign: "center",
  },
  deleteConfirmBtns: {
    display: "flex",
    gap: "10px",
  },
  confirmDeleteBtn: {
    padding: "9px 20px",
    background: "#ef4444",
    border: "none",
    borderRadius: "9px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  cancelDeleteBtn: {
    padding: "9px 20px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "9px",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  addCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px dashed rgba(255,255,255,0.1)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "40px 20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minHeight: "200px",
  },
  addCardIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addCardText: {
    fontSize: "13px",
    color: "#475569",
    fontWeight: "500",
  },

  // Modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalCard: {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 24px 0",
    marginBottom: "20px",
  },
  modalTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "18px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.3px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    borderRadius: "6px",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "10px",
    padding: "10px 14px",
    margin: "0 24px 16px",
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: "500",
  },
  modalForm: {
    padding: "0 24px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  formLabel: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#94a3b8",
    letterSpacing: "0.1px",
  },
  formHint: {
    fontSize: "11px",
    color: "#334155",
    marginTop: "2px",
  },
  formInput: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#f1f5f9",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
    transition: "all 0.2s ease",
  },
  inputWithPrefix: {
    position: "relative",
  },
  inputPrefix: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    color: "#475569",
    pointerEvents: "none",
    zIndex: 1,
  },
  preview: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "10px",
    padding: "14px",
  },
  previewLabel: {
    fontSize: "11px",
    color: "#475569",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "10px",
  },
  previewBar: {
    width: "100%",
    height: "5px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "100px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  previewFill: {
    height: "100%",
    background: "#22c55e",
    borderRadius: "100px",
  },
  previewFooter: {
    display: "flex",
    justifyContent: "space-between",
  },
  modalFooter: {
    display: "flex",
    gap: "10px",
    padding: "20px 24px 24px",
    marginTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  cancelBtn: {
    flex: 1,
    padding: "11px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  saveBtn: {
    flex: 2,
    padding: "11px",
    background: "linear-gradient(135deg, #22c55e, #10b981)",
    border: "none",
    borderRadius: "10px",
    color: "#020817",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(34,197,94,0.25)",
  },
}
