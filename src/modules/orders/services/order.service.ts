import { api } from "../../../shared/lib/api"
import type { CreateOrderResponse, CreateOrderSchemaType, GetOrdersResponse } from "../contracts/orders-contracts"

export const orderService = {
    create: async (order: CreateOrderSchemaType) => {
        const response = await api.post<CreateOrderResponse>("/orders", {
            body: order
        })
        return response.order
    },

    getOrders: async (page: number, limit: number) => {
        const response = await api.get<GetOrdersResponse>("/orders", {
            params: {
                page,
                limit,
            },
        })
        return response.orders
    },
}