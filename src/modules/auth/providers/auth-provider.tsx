import { useEffect, useState, type ReactNode } from "react"
import { type User } from "../contracts/session.contract"
import { authService } from "../services/auth.service"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      authService
        .me()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setReady(true))
    }

    checkSession()
  }, [])

  const establishSession = (userData: User) => {
    setUser(userData)
    setReady(true)
  }

  const logout = async () => {
    await authService.logout().catch(() => { })
    setUser(null)
  }

  const status = !ready ? "loading" : user ? "authenticated" : "anonymous"

  return (
    <AuthContext.Provider value={{ user, status, establishSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
