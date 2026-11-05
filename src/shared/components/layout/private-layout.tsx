import { Outlet } from "react-router"
import { useSession } from "../../../modules/auth/hooks/use-session"
import { AppSidebar } from "./app-sidebar"

export function PrivateLayout() {
  const { user } = useSession()

  if (!user) return null

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-background-canvas">
      <AppSidebar />
      <div className="min-w-0 flex-1 pt-3 pb-4 pr-4 pl-3">
        <main className="h-full overflow-auto rounded-2xl bg-background-surface shadow-sm ring-1 ring-brd-subtle p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
