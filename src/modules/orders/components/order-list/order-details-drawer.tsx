import { Dialog } from "radix-ui"
import { CreditCard, Package, UserRound, X } from "lucide-react"
import { currency, formatPhone } from "../../../../shared/utils/formatations"
import { paymentMethodLabels, type ItemType, type Order } from "../../contracts/orders-contracts"
import { formatOrderDate, formatOrderDateTime } from "./order-display"
import { OrderStatusBadge } from "./order-status-badge"
import { DeleteOrderPopup } from "./delete-order-popup"
import { UpdateOrderPopup } from "./update-order-popup"
import { Button } from "../../../../shared/components/ui"

const itemLabels: Record<ItemType, string> = {
    TABLE: "Mesa",
    CHAIR: "Cadeira",
    KIT: "Kit",
}

type OrderDetailsDrawerProps = {
    order: Order | null
    onClose: () => void
}

export function OrderDetailsDrawer({ order, onClose }: OrderDetailsDrawerProps) {
    if (!order) return null

    const customer = order.customer
    const address = [
        customer.street,
        customer.house_number,
        customer.district,
    ].filter(Boolean).join(", ")

    return (
        <Dialog.Root open onOpenChange={(open) => {
            if (!open) onClose()
        }}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-background-inverse/50 data-[state=open]:animate-fadeIn" />
                <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-xl flex-col bg-background-elevated shadow-xl focus:outline-none data-[state=open]:animate-slideInFromRight">
                    <header className="flex items-start justify-between gap-4 border-b border-brd-default p-5">
                        <div className="min-w-0 space-y-2">
                            <Dialog.Title className="truncate text-xl font-semibold text-content-primary">
                                Pedido #{order.id.split("-")[0].toUpperCase()}
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-content-muted">
                                Detalhes completos do pedido
                            </Dialog.Description>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <Dialog.Close asChild>
                          <Button size="icon" variant="outline" aria-label="Fechar detalhes do pedido">
                            <X className="size-4 text-content-muted" />
                          </Button>
                        </Dialog.Close>
                    </header>

                    <div className="flex flex-wrap gap-2 border-b border-brd-default p-4">
                        <UpdateOrderPopup order={order} onUpdated={onClose} />
                        <DeleteOrderPopup order={order} onDeleted={onClose} />
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto p-5">
                        <section className="space-y-3">
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-content-primary">
                                <UserRound className="size-4 text-content-accent" />
                                Cliente
                            </h2>
                            <dl className="grid grid-cols-1 gap-3 rounded-xl border border-brd-default p-4 sm:grid-cols-2">
                                <Detail label="Nome" value={customer.name} />
                                <Detail label="Telefone" value={formatPhone(customer.phone)} />
                                <Detail label="Endereço" value={address || "—"} />
                                <Detail label="Complemento" value={customer.complement || "—"} />
                            </dl>
                        </section>

                        <section className="space-y-3">
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-content-primary">
                                <Package className="size-4 text-content-accent" />
                                Itens do pedido
                            </h2>
                            {order.items.length === 0 ? (
                                <p className="rounded-xl border border-brd-default p-4 text-sm text-content-muted">
                                    Nenhum item informado.
                                </p>
                            ) : (
                                <ul className="divide-y divide-brd-subtle rounded-xl border border-brd-default px-4">
                                    {order.items.map((item, index) => (
                                        <li key={`${item.type}-${index}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                                            <span className="text-content-primary">{itemLabels[item.type]}</span>
                                            <span className="font-medium tabular-nums text-content-primary">{item.quantity} un.</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section className="space-y-3">
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-content-primary">
                                <CreditCard className="size-4 text-content-accent" />
                                Informações do pedido
                            </h2>
                            <dl className="grid grid-cols-1 gap-3 rounded-xl border border-brd-default p-4 sm:grid-cols-2">
                                <Detail label="Data de entrega" value={formatOrderDate(order.delivery_date)} />
                                <Detail label="Data de retirada" value={formatOrderDate(order.pickup_date)} />
                                <Detail label="Forma de pagamento" value={paymentMethodLabels[order.payment_method]} />
                                <Detail label="Valor total" value={currency.format(order.total_price)} />
                                <Detail label="Criado em" value={formatOrderDateTime(order.created_at)} />
                                <Detail label="Atualizado em" value={formatOrderDateTime(order.updated_at)} />
                                <div className="sm:col-span-2">
                                    <Detail label="Observações" value={order.observations || "Sem observações"} />
                                </div>
                            </dl>
                        </section>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0 space-y-1">
            <dt className="text-xs font-medium text-content-muted">{label}</dt>
            <dd className="break-words text-sm text-content-primary">{value}</dd>
        </div>
    )
}
