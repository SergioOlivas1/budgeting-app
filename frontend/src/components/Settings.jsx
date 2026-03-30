import { useState } from "react"

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Settings({ user, token, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("profile")

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    },
    {
      id: "security",
      label: "Security",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    },
  ]

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        input:focus { outline: none; border-color: rgba(34,197,94,0.5) !important; box-shadow: 0 0 0 3px rgba(34,197,94,0.08) !important; }
        input::placeholder { color: #334155; }
        .tab-btn:hover { background: rgba(255,255,255,0.05) !important; color: #f1f5f9 !important; }
        .tab-btn.active { background: rgba(34,197,94,0.1) !important; color: #22c55e !important; border-color: rgba(34,197,94,0.25) !important; }
        .save-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.35) !important; }
        .danger-btn:hover { background: rgba(239,68,68,0.15) !important; border-color: rgba(239,68,68,0.4) !important; }
        .logout-btn:hover { background: rgba(255,255,255,0.06) !important; }
        .bank-card:hover { border-color: rgba(255,255,255,0.12) !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Settings</h1>
          <p style={styles.pageSubtitle}>Manage your account and preferences</p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Sidebar Tabs */}
        <div style={styles.tabSidebar}>
          {/* Avatar */}
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {(user?.display_name || "U")[0].toUpperCase()}
            </div>
            <div style={styles.avatarInfo}>
              <p style={styles.avatarName}>{user?.display_name || "User"}</p>
              <p style={styles.avatarEmail}>{user?.email || ""}</p>
            </div>
          </div>

          {/* Tab Buttons */}
          <nav style={styles.tabNav}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tabBtn,
                  color: activeTab === tab.id ? "#22c55e" : "#64748b",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button
            className="logout-btn"
            style={styles.logoutBtn}
            onClick={onLogout}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Sign out
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {activeTab === "profile" && <ProfileTab user={user} token={token} onUpdateUser={onUpdateUser} />}
          {activeTab === "security"    && <SecurityTab token={token} />}
          {activeTab === "preferences" && <PreferencesTab onLogout={onLogout} token={token} />}
        </div>
      </div>
    </div>
  )
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ user, token, onUpdateUser }) {
  const [displayName, setDisplayName] = useState(user?.display_name || "")
  const [email, setEmail]             = useState(user?.email || "")
  const [saved, setSaved]             = useState(false)

  const handleSave = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ display_name: displayName, email })
      })
      if (res.ok) {
        const updatedUser = { ...user, display_name: displayName, email }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        if (onUpdateUser) onUpdateUser(updatedUser)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      console.error("Failed to update profile")
    }
  }

  return (
    <div style={styles.tabPanel}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Profile Information</h2>
        <p style={styles.sectionSubtitle}>Update your personal details</p>
      </div>

      {saved && (
        <div style={styles.successBanner}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2"/>
            <path d="M8 12l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Profile updated successfully!
        </div>
      )}

      <div style={styles.formCard}>
        {/* Avatar */}
        <div style={styles.avatarEditRow}>
          <div style={styles.avatarLarge}>
            {(user?.display_name || "U")[0].toUpperCase()}
          </div>
          <div>
            <p style={styles.avatarEditName}>{user?.display_name || "User"}</p>
            <p style={styles.avatarEditHint}>Your avatar is generated from your display name</p>
          </div>
        </div>

        <div style={styles.dividerLine} />

        {/* Fields */}
        <div style={styles.fieldsGrid}>
          <div style={styles.formField}>
            <label style={styles.formLabel}>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              style={styles.formInput}
              placeholder="Your name"
            />
          </div>
          <div style={styles.formField}>
            <label style={styles.formLabel}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.formInput}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div style={styles.formFooter}>
          <button className="save-btn" style={styles.saveBtn} onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab({ token }) {
  const [currentPw, setCurrentPw]   = useState("")
  const [newPw, setNewPw]           = useState("")
  const [confirmPw, setConfirmPw]   = useState("")
  const [error, setError]           = useState("")
  const [saved, setSaved]           = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")

  const getStrength = () => {
    if (!newPw) return null
    if (newPw.length < 6)  return { label: "Too short", color: "#ef4444", width: "25%" }
    if (newPw.length < 8)  return { label: "Weak",      color: "#f97316", width: "50%" }
    if (newPw.length < 12) return { label: "Good",      color: "#eab308", width: "75%" }
    return                        { label: "Strong",    color: "#22c55e", width: "100%" }
  }

  const strength = getStrength()

  const handleChangePassword = async () => {
    setError("")
    if (!currentPw || !newPw || !confirmPw) { setError("Please fill in all fields."); return }
    if (newPw !== confirmPw) { setError("New passwords do not match."); return }
    if (newPw.length < 6)   { setError("Password must be at least 6 characters."); return }
    try {
      const res = await fetch("http://127.0.0.1:5000/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ current_password: currentPw, new_password: newPw })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
      } else {
        setSaved(true)
        setCurrentPw(""); setNewPw(""); setConfirmPw("")
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setError("Unable to connect. Please try again.")
    }
  }

  return (
    <div style={styles.tabPanel}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Security</h2>
        <p style={styles.sectionSubtitle}>Manage your password and account security</p>
      </div>

      {/* Change Password */}
      <div style={styles.formCard}>
        <h3 style={styles.cardTitle}>Change Password</h3>

        {error && (
          <div style={styles.errorBanner}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {saved && (
          <div style={styles.successBanner}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2"/>
              <path d="M8 12l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Password changed successfully!
          </div>
        )}

        <div style={styles.fieldsStack}>
          <div style={styles.formField}>
            <label style={styles.formLabel}>Current Password</label>
            <input
              type="password"
              value={currentPw}
              onChange={e => setCurrentPw(e.target.value)}
              style={styles.formInput}
              placeholder="••••••••"
            />
          </div>
          <div style={styles.formField}>
            <label style={styles.formLabel}>New Password</label>
            <input
              type="password"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              style={styles.formInput}
              placeholder="••••••••"
            />
            {strength && (
              <div style={styles.strengthWrap}>
                <div style={styles.strengthTrack}>
                  <div style={{ ...styles.strengthFill, width: strength.width, background: strength.color }} />
                </div>
                <span style={{ fontSize: "11px", color: strength.color, fontWeight: "600", minWidth: "52px", textAlign: "right" }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>
          <div style={styles.formField}>
            <label style={styles.formLabel}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              style={{
                ...styles.formInput,
                borderColor: confirmPw && confirmPw !== newPw ? "rgba(239,68,68,0.5)" : undefined
              }}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div style={styles.formFooter}>
          <button className="save-btn" style={styles.saveBtn} onClick={handleChangePassword}>
            Update Password
          </button>
        </div>
      </div>

      {/* Delete Account */}
      <div style={{ ...styles.formCard, borderColor: "rgba(239,68,68,0.15)" }}>
        <h3 style={{ ...styles.cardTitle, color: "#ef4444" }}>Danger Zone</h3>
        <p style={styles.dangerText}>
          Once you delete your account all your data will be permanently removed and cannot be recovered.
        </p>

        {!showDeleteConfirm ? (
          <button
            className="danger-btn"
            style={styles.dangerBtn}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        ) : (
          <div style={styles.deleteConfirmBox}>
            <p style={styles.deleteConfirmText}>
              Type <strong style={{ color: "#ef4444" }}>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              style={styles.formInput}
              placeholder="Type DELETE here"
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button
                style={{
                  ...styles.dangerBtn,
                  opacity: deleteInput !== "DELETE" ? 0.5 : 1,
                  cursor: deleteInput !== "DELETE" ? "not-allowed" : "pointer",
                }}
                disabled={deleteInput !== "DELETE"}
              >
                Permanently Delete
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput("") }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Preferences Tab ──────────────────────────────────────────────────────────
function PreferencesTab({ onLogout }) {
  const [darkMode, setDarkMode]         = useState(true)
  const [bankConnected, setBankConnected] = useState(false)
  const [currency, setCurrency]         = useState("USD")
  const [notifications, setNotifications] = useState(true)

  return (
    <div style={styles.tabPanel}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Preferences</h2>
        <p style={styles.sectionSubtitle}>Customize your BudgetWise experience</p>
      </div>

      {/* Appearance */}
      <div style={styles.formCard}>
        <h3 style={styles.cardTitle}>Appearance</h3>
        <div style={styles.preferencesList}>
          <div style={styles.preferenceRow}>
            <div>
              <p style={styles.preferenceLabel}>Dark Mode</p>
              <p style={styles.preferenceHint}>Use dark theme across the app</p>
            </div>
            <Toggle value={darkMode} onChange={setDarkMode} />
          </div>
          <div style={styles.prefDivider} />
          <div style={styles.preferenceRow}>
            <div>
              <p style={styles.preferenceLabel}>Budget Alerts</p>
              <p style={styles.preferenceHint}>Get warnings when approaching budget limits</p>
            </div>
            <Toggle value={notifications} onChange={setNotifications} />
          </div>
          <div style={styles.prefDivider} />
          <div style={styles.preferenceRow}>
            <div>
              <p style={styles.preferenceLabel}>Currency</p>
              <p style={styles.preferenceHint}>Choose your display currency</p>
            </div>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              style={styles.selectSmall}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Connected Banks */}
      <div style={styles.formCard}>
        <h3 style={styles.cardTitle}>Connected Bank Accounts</h3>
        <p style={styles.sectionSubtitleSmall}>
          Manage your Plaid bank connections
        </p>

        {bankConnected ? (
          <div className="bank-card" style={styles.bankCard}>
            <div style={styles.bankLeft}>
              <div style={styles.bankIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#22c55e" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <p style={styles.bankName}>Chase Bank</p>
                <p style={styles.bankMeta}>Connected · Last synced today</p>
              </div>
            </div>
            <button
              style={styles.disconnectBtn}
              onClick={() => setBankConnected(false)}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div style={styles.noBankCard}>
            <div style={styles.noBankIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#475569" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <p style={styles.noBankTitle}>No bank connected</p>
              <p style={styles.noBankHint}>Connect your bank to automatically import transactions</p>
            </div>
            <button style={styles.connectBtn}>
              Connect Bank
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Toggle Component ─────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "100px",
        background: value ? "linear-gradient(135deg, #22c55e, #10b981)" : "rgba(255,255,255,0.1)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s ease",
        flexShrink: 0,
        boxShadow: value ? "0 2px 8px rgba(34,197,94,0.3)" : "none",
      }}
    >
      <div style={{
        position: "absolute",
        top: "3px",
        left: value ? "23px" : "3px",
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        background: "#fff",
        transition: "left 0.2s ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
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
    marginBottom: "28px",
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
  layout: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: "24px",
    alignItems: "start",
  },
  tabSidebar: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "20px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    position: "sticky",
    top: "36px",
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "8px 0 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    marginBottom: "8px",
  },
  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e, #10b981)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
    color: "#020817",
    fontFamily: "'Sora', sans-serif",
    boxShadow: "0 4px 12px rgba(34,197,94,0.25)",
  },
  avatarInfo: {
    textAlign: "center",
  },
  avatarName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: "2px",
  },
  avatarEmail: {
    fontSize: "11px",
    color: "#475569",
  },
  tabNav: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  tabBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid transparent",
    background: "transparent",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all 0.15s ease",
    textAlign: "left",
    width: "100%",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
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
    marginTop: "8px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    paddingTop: "14px",
  },
  tabContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  tabPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    animation: "fadeUp 0.3s ease both",
  },
  sectionHeader: {
    marginBottom: "4px",
  },
  sectionTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "18px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.3px",
    marginBottom: "4px",
  },
  sectionSubtitle: {
    fontSize: "13px",
    color: "#475569",
  },
  sectionSubtitleSmall: {
    fontSize: "13px",
    color: "#475569",
    marginBottom: "14px",
  },
  formCard: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "24px",
  },
  cardTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: "18px",
    letterSpacing: "-0.2px",
  },
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(34,197,94,0.07)",
    border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: "10px",
    padding: "10px 14px",
    marginBottom: "18px",
    color: "#22c55e",
    fontSize: "13px",
    fontWeight: "500",
    animation: "fadeIn 0.3s ease both",
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "10px",
    padding: "10px 14px",
    marginBottom: "18px",
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: "500",
  },
  avatarEditRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  avatarLarge: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e, #10b981)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
    color: "#020817",
    fontFamily: "'Sora', sans-serif",
    flexShrink: 0,
    boxShadow: "0 4px 14px rgba(34,197,94,0.25)",
  },
  avatarEditName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: "3px",
  },
  avatarEditHint: {
    fontSize: "12px",
    color: "#475569",
  },
  dividerLine: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    marginBottom: "20px",
  },
  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px",
  },
  fieldsStack: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "20px",
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
  formFooter: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "4px",
  },
  saveBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #22c55e, #10b981)",
    border: "none",
    borderRadius: "10px",
    color: "#020817",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(34,197,94,0.25)",
  },
  strengthWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "4px",
  },
  strengthTrack: {
    flex: 1,
    height: "4px",
    background: "rgba(255,255,255,0.07)",
    borderRadius: "100px",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: "100px",
    transition: "width 0.3s ease, background 0.3s ease",
  },
  dangerText: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.6",
    marginBottom: "16px",
  },
  dangerBtn: {
    padding: "10px 20px",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "10px",
    color: "#ef4444",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  deleteConfirmBox: {
    background: "rgba(239,68,68,0.05)",
    border: "1px solid rgba(239,68,68,0.12)",
    borderRadius: "12px",
    padding: "16px",
  },
  deleteConfirmText: {
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "10px",
  },
  preferencesList: {
    display: "flex",
    flexDirection: "column",
  },
  preferenceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
  },
  prefDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.05)",
  },
  preferenceLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#e2e8f0",
    marginBottom: "3px",
  },
  preferenceHint: {
    fontSize: "12px",
    color: "#475569",
  },
  selectSmall: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "7px 12px",
    fontSize: "13px",
    color: "#f1f5f9",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  bankCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(34,197,94,0.05)",
    border: "1px solid rgba(34,197,94,0.15)",
    borderRadius: "12px",
    padding: "14px 16px",
    transition: "border-color 0.2s ease",
  },
  bankLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  bankIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "9px",
    background: "rgba(34,197,94,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bankName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: "2px",
  },
  bankMeta: {
    fontSize: "12px",
    color: "#22c55e",
  },
  disconnectBtn: {
    padding: "7px 14px",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "8px",
    color: "#ef4444",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  noBankCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "rgba(255,255,255,0.02)",
    border: "1px dashed rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "16px",
  },
  noBankIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  noBankTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "2px",
  },
  noBankHint: {
    fontSize: "12px",
    color: "#334155",
  },
  connectBtn: {
    marginLeft: "auto",
    padding: "8px 16px",
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: "8px",
    color: "#22c55e",
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    flexShrink: 0,
  },
}
