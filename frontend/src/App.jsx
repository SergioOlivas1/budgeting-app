import { useState } from "react"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"

function App() {
  const [page, setPage] = useState("login")
  const [user, setUser] = useState(null)

  if (page === "dashboard") return <Dashboard user={user} onLogout={() => setPage("login")} />
  if (page === "register") return <Register onSwitch={() => setPage("login")} />
  return <Login onSwitch={() => setPage("register")} onLogin={(u) => { setUser(u); setPage("dashboard") }} />
}

export default App
