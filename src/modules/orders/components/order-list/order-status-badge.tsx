import type { OrderStatus } from "../../contracts/orders-contracts"
import { orderStatusLabels } from "./order-status-labels"

const statusClassNames: Record<OrderStatus, string> = {
    PENDING_DELIVERY: "bg-badge-info-bg text-badge-info-content",
    PENDING_PICKUP: "bg-badge-warning-bg text-badge-warning-content",
    DELIVERED: "bg-badge-success-bg text-badge-success-content",
    CANCELLED: "bg-badge-danger-bg text-badge-danger-content",
    COMPLETED: "bg-badge-muted-bg text-badge-muted-content",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClassNames[status]}`}>
            {orderStatusLabels[status]}
        </span>
    )
}
