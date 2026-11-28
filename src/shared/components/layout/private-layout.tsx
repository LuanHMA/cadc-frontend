import { Outlet } from "react-router"
import { useSession } from "../../../modules/auth/hooks/use-session"
import { AppSidebar } from "./app-sidebar"

export function PrivateLayout() {
  const { user } = useSession()

  if (!user) return null

  return (
    <div className="min-h-screen flex bg-background-canvas">
      <AppSidebar />

      <div className="p-6 bg-background-base min-h-screen flex-1">
        <Outlet />
      </div>
    </div>
  )
}
