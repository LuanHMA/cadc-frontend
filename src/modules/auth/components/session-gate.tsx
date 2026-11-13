import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router"
import { useSession } from "../hooks/use-session"

export function SessionLoading() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-background-base text-sm text-content-muted">
      Carregando sessão...
    </div>
  )
}

export function RequireSession({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const location = useLocation()

  if (status === "loading") return <SessionLoading />
  if (status === "anonymous") {
    return <Navigate to="/entrar" state={{ lastPathVisited: location.pathname }} replace />
  }

  return children
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { status } = useSession()

  if (status === "loading") return <SessionLoading />
  if (status === "authenticated") return <Navigate to="/" replace />

  return children
}
