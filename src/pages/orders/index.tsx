import { OrderList } from "../../modules/orders/components/order-list";

export function OrdersPage() {
    return (
        <main className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold text-content-primary">Pedidos</h1>
            </div>

            <OrderList />
        </main>
    )
}