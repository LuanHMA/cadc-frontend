import { use } from "react"
import { AuthContext } from "../providers/auth-context"

export function useSession() {
  const session = use(AuthContext)
  if (!session) {
    throw new Error("useSession deve ser usado dentro de AuthProvider")
  }
  return session
}
