import { useEffect, useState, type ReactNode } from "react"
import { bindSessionLost } from "../../../shared/lib/api"
import { authService } from "../services/auth.service"
import { type User } from "../contracts/session.contract"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    return bindSessionLost(() => {
      setUser(null)
      setReady(true)
    })
  }, [])

  useEffect(() => {
    let active = true

    authService
      .me()
      .then((data) => {
        if (!active) return
        setUser(data)
      })
      .catch(() => {
        if (!active) return
        setUser(null)
      })
      .finally(() => {
        if (active) setReady(true)
      })

    return () => {
      active = false
    }
  }, [])

  const establishSession = (userData: User) => {
    setUser(userData)
    setReady(true)
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
    } finally {
      setUser(null)
    }
  }

  const status = !ready ? "loading" : user ? "authenticated" : "anonymous"

  return (
    <AuthContext.Provider value={{ user, status, establishSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
