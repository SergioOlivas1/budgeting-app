import { useState } from "react"
import Login from "./components/Login"
import Register from "./components/Register"

function App() {
  const [showRegister, setShowRegister] = useState(false)

  return showRegister
    ? <Register onSwitch={() => setShowRegister(false)} />
    : <Login onSwitch={() => setShowRegister(true)} onLogin={() => {}} />
}

export default App
