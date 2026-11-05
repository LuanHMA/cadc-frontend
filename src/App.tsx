import { AuthProvider } from "./modules/auth/providers/auth-provider.tsx"
import { AppRoutes } from "./routes.tsx"
import { QueryProvider } from "./shared/providers/query-provider.tsx"
import { ToastifyProvider } from "./shared/providers/toastify-provider.tsx"

export function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastifyProvider />
        <AppRoutes />
      </AuthProvider>
    </QueryProvider>
  )
}
