import { ClipboardList, LayoutDashboard, Package, PlusIcon, Users } from "lucide-react"
import { useState, type ReactNode } from "react"
import { NavLink } from "react-router"
import { useSession } from "../../../modules/auth/hooks/use-session"
import { LogoMark } from "../logo"
import { Button } from "../ui"
import { cn } from "../ui/cn"

const links: Array<{ to: string; label: string; icon: ReactNode }> = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard/> },
  { to: "/pedidos/novo", label: "Novo pedido", icon: <PlusIcon/> },
  { to: "/pedidos", label: "Pedidos", icon: <ClipboardList /> },
  { to: "/estoque", label: "Estoque", icon: <Package/> },
  { to: "/clientes", label: "Clientes", icon: <Users/> },
]

export function AppSidebar() {
  const { user, logout } = useSession()
  const [leaving, setLeaving] = useState(false)

  async function onLogout() {
    setLeaving(true)
    try {
      await logout()
    } finally {
      setLeaving(false)
    }
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-background-canvas px-3 py-4">
      <NavLink to="/" className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
        <LogoMark className="size-9" />
        <span className="text-base font-semibold tracking-tight text-content-inverse">CADC</span>
      </NavLink>

      <nav className="mt-6 flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-background-accent text-content-inverse"
                  : "text-content-inverse/70 hover:bg-background-surface/10 hover:text-content-inverse",
              )
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 pt-4">
        {user ? (
          <div className="mb-3 min-w-0">
            <p className="truncate text-sm font-medium text-content-inverse">{user.name}</p>
            <p className="truncate text-xs text-content-inverse/60">{user.email}</p>
          </div>
        ) : null}
        <Button type="button" variant="primary" size="sm" className="w-full" loading={leaving} onClick={onLogout}>
          Sair
        </Button>
      </div>
    </aside>
  )
}
