import { createContext } from "react"
import type { User } from "../contracts/session.contract"

export type AuthStatus = "loading" | "authenticated" | "anonymous"

export type AuthContextValue = {
  user: User | null
  status: AuthStatus
  establishSession: (user: User) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
