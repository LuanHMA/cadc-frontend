import { LoginForm } from "../../modules/auth/components/login-form"
import { Logo } from "../../shared/components/logo"

export function LoginPage() {
    return (
        <div className="w-screen min-h-screen bg-background-base flex items-center justify-center">
            <div className="w-full max-w-96 m-auto space-y-4 bg-background-surface p-6 rounded-2xl border border-brd-default">
                <Logo />
                <div className="flex flex-col items-start gap-0">
                    <h1 className="text-2xl font-semibold text-content-primary">Entrar</h1>
                    <p className="text-content-muted text-sm">Olá, bem-vindo de volta!</p>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}