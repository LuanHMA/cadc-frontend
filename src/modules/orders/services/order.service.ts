import { api } from "../../../shared/lib/api"
import type {
    CreateOrderResponse,
    CreateOrderSchemaType,
    GetOrdersResponse,
    OrderStatus,
    UpdateOrderSchemaType,
} from "../contracts/orders-contracts"

export type ListOrdersQuery = {
    page: number
    limit: number
    name?: string
    status?: OrderStatus
    delivery_date_from?: string
    delivery_date_to?: string
    pickup_date_from?: string
    pickup_date_to?: string
}

export const orderService = {
    create: async (order: CreateOrderSchemaType) => {
        const response = await api.post<CreateOrderResponse>("/orders", {
            body: order
        })
        return response.order
    },

    update: (id: string, order: UpdateOrderSchemaType) =>
        api.put<{ message: string }>(`/orders/${id}`, { body: order }),

    cancelOrder: (id: string) =>
        api.put<{ message: string }>(`/orders/${id}`, {
            body: {
                status: "CANCELLED",
            }
        }),

    list: async (query: ListOrdersQuery, signal?: AbortSignal): Promise<GetOrdersResponse> => {
        const response = await api.get<GetOrdersResponse>("/orders", {
            query,
            signal,
        })
        return response
    },
}