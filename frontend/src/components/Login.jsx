import { useState } from "react"

export default function Login({ onSwitch, onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState("")

  const handleLogin = async () => {
    setError("")
    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error)
      } else {
        if (onLogin) onLogin(data.user)
      }
    } catch {
      setError("Unable to connect. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        input::placeholder { color: #334155; }
        input:focus { outline: none; }
        .signin-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(34,197,94,0.45) !important;
        }
        .signin-btn:active:not(:disabled) { transform: translateY(0); }
        .signup-link:hover { text-decoration: underline; }
        .forgot-link:hover { opacity: 0.7; }
        .sso-btn:hover {
          background: rgba(255,255,255,0.07) !important;
          border-color: rgba(255,255,255,0.15) !important;
          color: #e2e8f0 !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(60px,-40px) scale(1.1); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-50px,50px) scale(1.08); }
        }
        @keyframes orb3 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(30px,30px); }
        }
      `}</style>

      {/* Background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />
      <div style={styles.grid} />

      {/* Card */}
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4H9l3-6 3 6h-2v4z" fill="#020817"/>
            </svg>
          </div>
          <span style={styles.logoText}>BudgetWise</span>
        </div>

        {/* Heading */}
        <div style={styles.heading}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to continue to your dashboard</p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <div style={styles.form}>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email address</label>
            <div style={{ ...styles.inputWrap, ...(focused === "email" ? styles.inputWrapFocused : {}) }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  stroke={focused === "email" ? "#22c55e" : "#475569"} strokeWidth="1.5"/>
                <path d="M22 6l-10 7L2 6"
                  stroke={focused === "email" ? "#22c55e" : "#475569"} strokeWidth="1.5"/>
              </svg>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                onKeyDown={handleKeyDown}
                style={styles.input}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Password</label>
              <span className="forgot-link" style={styles.forgotLink}>Forgot password?</span>
            </div>
            <div style={{ ...styles.inputWrap, ...(focused === "password" ? styles.inputWrapFocused : {}) }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <rect x="3" y="11" width="18" height="11" rx="2"
                  stroke={focused === "password" ? "#22c55e" : "#475569"} strokeWidth="1.5"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"
                  stroke={focused === "password" ? "#22c55e" : "#475569"} strokeWidth="1.5"/>
              </svg>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                onKeyDown={handleKeyDown}
                style={styles.input}
              />
            </div>
          </div>

          {/* Remember me */}
          <label style={styles.rememberLabel}>
            <input type="checkbox" style={styles.checkbox} />
            <span style={styles.rememberText}>Remember me for 30 days</span>
          </label>

          {/* Submit */}
          <button
            className="signin-btn"
            onClick={handleLogin}
            disabled={loading}
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
          >
            {loading
              ? <span style={styles.loadingRow}><span style={styles.spinner} />Signing in...</span>
              : "Sign in →"
            }
          </button>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.divLine} />
          <span style={styles.divText}>or continue with</span>
          <div style={styles.divLine} />
        </div>

        {/* SSO */}
        <div style={styles.ssoRow}>
          <button className="sso-btn" style={styles.ssoBtn}>
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="sso-btn" style={styles.ssoBtn}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#f1f5f9">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Sign up */}
        <p style={styles.signupText}>
          Don't have an account?{" "}
          <span className="signup-link" style={styles.signupLink} onClick={onSwitch}>
            Sign up for free
          </span>
        </p>
      </div>

      {/* Footer */}
      <p style={styles.footer}>Secure · Private · Free</p>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#020817",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    padding: "32px 16px",
    position: "relative",
    overflow: "hidden",
  },

  // Background
  orb1: {
    position: "fixed",
    width: "800px",
    height: "800px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.11) 0%, transparent 65%)",
    top: "-200px",
    left: "-200px",
    animation: "orb1 12s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  orb2: {
    position: "fixed",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)",
    bottom: "-100px",
    right: "-100px",
    animation: "orb2 14s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  orb3: {
    position: "fixed",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 65%)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: "orb3 9s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "56px 56px",
    pointerEvents: "none",
    zIndex: 0,
  },

  // Card
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "460px",
    background: "rgba(15, 23, 42, 0.80)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "24px",
    padding: "44px 44px 40px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
    animation: "fadeUp 0.5s ease both",
  },

  // Logo
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
  },
  logoIcon: {
    width: "38px",
    height: "38px",
    background: "linear-gradient(135deg, #22c55e, #10b981)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.3px",
  },

  // Heading
  heading: {
    marginBottom: "28px",
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "30px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.6px",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
  },

  // Error
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "10px",
    padding: "11px 14px",
    marginBottom: "20px",
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: "500",
  },

  // Form
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#94a3b8",
    letterSpacing: "0.1px",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#22c55e",
    cursor: "pointer",
    fontWeight: "500",
    transition: "opacity 0.2s",
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "0 15px",
    transition: "all 0.2s ease",
  },
  inputWrapFocused: {
    border: "1px solid rgba(34,197,94,0.5)",
    background: "rgba(34,197,94,0.04)",
    boxShadow: "0 0 0 3px rgba(34,197,94,0.08)",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    padding: "13px 0",
    fontSize: "14px",
    color: "#f1f5f9",
    fontFamily: "'DM Sans', sans-serif",
    minWidth: 0,
  },
  rememberLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  checkbox: {
    width: "15px",
    height: "15px",
    accentColor: "#22c55e",
    cursor: "pointer",
    flexShrink: 0,
  },
  rememberText: {
    fontSize: "13px",
    color: "#64748b",
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #22c55e, #10b981)",
    border: "none",
    borderRadius: "12px",
    color: "#020817",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 16px rgba(34,197,94,0.28)",
    letterSpacing: "0.2px",
    marginTop: "4px",
  },
  btnDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "15px",
    height: "15px",
    border: "2px solid rgba(2,8,23,0.25)",
    borderTopColor: "#020817",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },

  // Divider
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0 20px",
  },
  divLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.07)",
  },
  divText: {
    fontSize: "12px",
    color: "#334155",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },

  // SSO
  ssoRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  ssoBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // Sign up
  signupText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#64748b",
  },
  signupLink: {
    color: "#22c55e",
    fontWeight: "600",
    cursor: "pointer",
  },

  // Footer
  footer: {
    position: "relative",
    zIndex: 1,
    marginTop: "24px",
    fontSize: "11px",
    color: "#1e293b",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontWeight: "500",
  },
}