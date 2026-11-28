import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { NewOrderForm } from "../../../modules/orders/components/new-order/new-order-form"

export function NewOrderPage() {
    return (
        <main className="space-y-4">
            <div className="flex items-center gap-3">
                <Link
                    to="/pedidos"
                    aria-label="Voltar para pedidos"
                    className="flex size-9 items-center justify-center  rounded-xl border border-brd-default text-content-muted transition-colors hover:text-content-primary"
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-2xl font-semibold text-content-primary">Novo pedido</h1>
            </div>
            <NewOrderForm />
        </main>
    )
}
