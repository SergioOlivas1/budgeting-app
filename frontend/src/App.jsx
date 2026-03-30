import { useState } from "react"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"

function App() {
  const [page, setPage]   = useState(() => localStorage.getItem("token") ? "dashboard" : "login")
  const [user, setUser]   = useState(() => JSON.parse(localStorage.getItem("user") || "null"))
  const [token, setToken] = useState(() => localStorage.getItem("token") || null)

  const handleLogin = (userData, accessToken) => {
    localStorage.setItem("token", accessToken)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    setToken(accessToken)
    setPage("dashboard")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setToken(null)
    setPage("login")
  }

  const handleUpdateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  if (page === "dashboard") return (
    <Dashboard
      user={user}
      token={token}
      onLogout={handleLogout}
      onUpdateUser={handleUpdateUser}
    />
  )
  if (page === "register") return (
    <Register onSwitch={() => setPage("login")} />
  )
  return (
    <Login onSwitch={() => setPage("register")} onLogin={handleLogin} />
  )
}

export default App