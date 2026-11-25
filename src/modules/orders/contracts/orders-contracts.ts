import z from "zod";
import type { Pagination } from "../../../shared/types/pagination";
import type { Customer } from "../../customers/contracts/customers-contracts";
import type { Product } from "../../stock/contracts/stock.contracts";

export type OrderStatus = "PENDING_DELIVERY" | "DELIVERED" | "CANCELLED" | "PENDING_PICKUP" | "COMPLETED";

export type PaymentMethod = "CASH" | "PIX" | "CREDIT_CARD" | "DEBIT_CARD" | "OTHER"

export type Order = {
    id: string
    customer_id: string
    delivery_date: string
    pickup_date: string
    status: OrderStatus
    payment_method: PaymentMethod
    total_price: number
    observations: string
    created_at: string
    updated_at: string
    customer: Customer
    items: OrderItem[]
}

export type OrderItem = {
    product_id: string
    quantity: number
    unit_price: number
    subtotal: number
    product: {
        name: string
    }
}

export type GetOrdersResponse = {
    orders: Order[]
    pagination: Pagination
    message: string
}

// Create Order
export const CreateOrderSchema = z.object({
    customer_id: z.string("Cliente é obrigatório").trim().min(1, "Cliente é obrigatório"),
    delivery_date: z.string("Data de entrega é obrigatória").trim().min(1, "Data de entrega é obrigatória"),
    pickup_date: z.string("Data de retirada é obrigatória").trim().min(1, "Data de retirada é obrigatória"),
    payment_method: z.enum(["CASH", "PIX", "CREDIT_CARD", "DEBIT_CARD", "OTHER"], "Forma de pagamento é obrigatória"),
    observations: z.string("Observações são obrigatórias").trim().optional(),
    items: z.array(z.object({
        product_id: z.enum(["TABLE", "CHAIR", "KIT"]),
        qtd: z.number("Quantidade é obrigatória").min(1, "Quantidade deve ser maior que 0"),
    })).min(1, "Selecione ao menos um item"),
}).refine((data) => !data.delivery_date || !data.pickup_date || data.pickup_date >= data.delivery_date, {
    path: ["pickup_date"],
    message: "Data de recolhimento deve ser igual ou posterior à entrega",
})

export type CreateOrderSchemaType = z.infer<typeof CreateOrderSchema>

export const emptyOrderForm: Partial<CreateOrderSchemaType> = {
    customer_id: "",
    delivery_date: "",
    pickup_date: "",
    observations: "",
    items: [],
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
    PIX: "Pix",
    CASH: "Dinheiro",
    CREDIT_CARD: "Crédito",
    DEBIT_CARD: "Débito",
    OTHER: "Outro",
}

export const PROMOTIONAL_MIN_QUANTITY = 10

export function getItemUnitPrice(product: Product, quantity: number) {
    if (product.id === "KIT" || product.promocional_price == null || quantity <= PROMOTIONAL_MIN_QUANTITY) {
        return product.unit_price
    }
    return product.promocional_price
}

export function getItemTotal(product: Product, quantity: number) {
    return getItemUnitPrice(product, quantity) * quantity
}

export type CreateOrderResponse = {
    message: string
    order: Order
}