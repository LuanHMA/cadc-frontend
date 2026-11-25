import type { OrderStatus } from "../../contracts/orders-contracts"

export const orderStatusLabels: Record<OrderStatus, string> = {
    PENDING_DELIVERY: "Pendente de entrega",
    PENDING_PICKUP: "Pendente de recolhimento",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
    COMPLETED: "Finalizado",
}
