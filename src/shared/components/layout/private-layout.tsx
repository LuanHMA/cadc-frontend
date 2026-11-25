import { Outlet } from "react-router"
import { useSession } from "../../../modules/auth/hooks/use-session"
import { AppSidebar } from "./app-sidebar"

export function PrivateLayout() {
  const { user } = useSession()

  if (!user) return null

  return (
    <div className="flex min-h-screen w-screen overflow-hidden bg-background-canvas">
      <AppSidebar />
      <div className="min-w-0 flex-1 p-4">
        <main className="h-full overflow-auto rounded-2xl bg-background-surface shadow-sm ring-1 ring-brd-subtle p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
