import { useSession } from "../../modules/auth/hooks/use-session"

export function DashboardPage() {

  const { user } = useSession()

  if (!user) return null

  return (
    <div className="space-y-0">
      <h1 className="text-2xl font-semibold text-content-primary">Olá, {user.name}</h1>
      <p className="mt-1 text-sm text-content-muted">{user.email}</p>
    </div>
  )
}
