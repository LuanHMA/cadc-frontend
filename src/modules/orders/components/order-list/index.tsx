import { useState } from "react"
import { ChevronRight, SearchX } from "lucide-react"
import { Pagination } from "../../../../shared/components/ui"
import { currency, formatPhone } from "../../../../shared/utils/formatations"
import type { Order } from "../../contracts/orders-contracts"
import { useGetOrders } from "../../hooks/use-get-orders"
import { OrderDetailsDrawer } from "./order-details-drawer"
import { formatOrderDate, formatOrderItems } from "./order-display"
import { OrderListFilters } from "./order-list-filters"
import { OrderStatusBadge } from "./order-status-badge"

export function OrderList() {
    const {
        orders,
        pagination,
        isLoading,
        isError,
        page,
        setPage,
        name,
        setName,
        status,
        setStatus,
        deliveryDateFrom,
        setDeliveryDateFrom,
        deliveryDateTo,
        setDeliveryDateTo,
        hasActiveFilters,
    } = useGetOrders()
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const rawTotal = Number(pagination.total)
    const totalOrders = Number.isFinite(rawTotal) && rawTotal >= 0 ? rawTotal : orders.length
    const rawPageSize = Number(pagination.limit)
    const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0 ? rawPageSize : 10
    const totalPages = Math.ceil(totalOrders / pageSize)
    const shouldShowPagination = orders.length > 0 && totalOrders > pageSize

    return (
        <>
            <section className="overflow-hidden rounded-xl border border-brd-default bg-background-elevated">
                <div className="border-b border-brd-default p-4">
                    <OrderListFilters
                        name={name}
                        status={status}
                        deliveryDateFrom={deliveryDateFrom}
                        deliveryDateTo={deliveryDateTo}
                        onNameChange={setName}
                        onStatusChange={setStatus}
                        onDeliveryDateFromChange={setDeliveryDateFrom}
                        onDeliveryDateToChange={setDeliveryDateTo}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-245 text-left text-sm">
                        <colgroup>
                            <col className="w-[22%]" />
                            <col className="w-[17%]" />
                            <col className="w-[18%]" />
                            <col className="w-[14%]" />
                            <col className="w-[14%]" />
                            <col className="w-[15%]" />
                        </colgroup>
                        <thead className="bg-background-base text-xs font-medium uppercase tracking-wide text-content-muted">
                            <tr>
                                <th scope="col" className="px-4 py-3">Pedido</th>
                                <th scope="col" className="px-4 py-3">Cliente</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3">Data de entrega</th>
                                <th scope="col" className="px-4 py-3">Data de retirada</th>
                                <th scope="col" className="px-4 py-3 text-right">Valor total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-content-muted" role="status">
                                        Carregando pedidos…
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-content-danger" role="alert">
                                        Erro ao buscar pedidos. Tente novamente.
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10">
                                        <div className="flex flex-col items-center gap-2 text-center">
                                            <SearchX className="size-6 text-content-muted" />
                                            <p className="text-sm font-medium text-content-primary">
                                                {hasActiveFilters ? "Nenhum pedido encontrado" : "Nenhum pedido cadastrado"}
                                            </p>
                                            <p className="text-sm text-content-muted">
                                                {hasActiveFilters ? "Não há pedidos que correspondam aos filtros." : "Os pedidos aparecerão aqui quando forem cadastrados."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <OrderRow key={order.id} order={order} onSelect={setSelectedOrder} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && !isError ? (
                    <footer className="flex flex-col gap-4 border-t border-brd-default p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-content-muted">
                            {totalOrders} {totalOrders === 1 ? "pedido encontrado" : "pedidos encontrados"}
                        </p>
                        {shouldShowPagination ? (
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        ) : null}
                    </footer>
                ) : null}
            </section>

            <OrderDetailsDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </>
    )
}

function OrderRow({ order, onSelect }: { order: Order; onSelect: (order: Order) => void }) {
    return (
        <tr className="border-t border-brd-default">
            <td colSpan={6} className="p-0">
                <button
                    type="button"
                    aria-label={`Ver detalhes do pedido ${order.id}`}
                    onClick={() => onSelect(order)}
                    className="grid w-full grid-cols-[22%_17%_18%_14%_14%_15%] items-center text-left transition-colors hover:bg-background-base focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-input-focus-border cursor-pointer"
                >
                    <span className="min-w-0 space-y-1 px-4 py-4">
                        <span className="block truncate text-sm uppercase text-content-primary">{formatOrderItems(order.items)}</span>
                    </span>
                    <span className="min-w-0 space-y-1 px-4 py-4">
                        <span className="block truncate font-medium text-content-primary">{order.customer.name}</span>
                        <span className="block truncate text-xs text-content-muted">{formatPhone(order.customer.phone)}</span>
                    </span>
                    <span className="px-4 py-4"><OrderStatusBadge status={order.status} /></span>
                    <span className="whitespace-nowrap px-4 py-4 text-content-primary">{formatOrderDate(order.delivery_date)}</span>
                    <span className="whitespace-nowrap px-4 py-4 text-content-primary">{formatOrderDate(order.pickup_date)}</span>
                    <span className="flex items-center justify-end gap-2 whitespace-nowrap px-4 py-4 font-semibold tabular-nums text-content-primary">
                        {currency.format(order.total_price)}
                        <ChevronRight className="size-4 shrink-0 text-content-muted" />
                    </span>
                </button>
            </td>
        </tr>
    )
}