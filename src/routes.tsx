import { Navigate, Route, Routes } from "react-router"
import { GuestOnly, RequireSession } from "./modules/auth/components/session-gate.tsx"
import { CustomersPage } from "./pages/customers/index.tsx"
import { DashboardPage } from "./pages/dashboard/index.tsx"
import { LoginPage } from "./pages/login/index.tsx"
import { StockPage } from "./pages/stock/index.tsx"
import { PrivateLayout } from "./shared/components/layout/private-layout.tsx"

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/entrar"
        element={
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        }
        errorElement={<Navigate to="/" replace />}
      />
      <Route
        element={
          <RequireSession>
            <PrivateLayout />
          </RequireSession>
        }
        errorElement={<Navigate to="/entrar" replace />}
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/estoque" element={<StockPage />} />
        <Route path="/clientes" element={<CustomersPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
        errorElement={<Navigate to="/entrar" replace />}
      />
    </Routes>
  )
}
