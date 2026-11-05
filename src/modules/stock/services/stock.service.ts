import { api } from "../../../shared/lib/api"
import type { Product, StockResponse, UpdateProductBody, UpdateProductResponse } from "../contracts/stock.contracts"

export const stockService = {
    list() {
        return api.get<StockResponse>("/products")
    },

    update(id: Product["id"], body: UpdateProductBody) {
        return api.put<UpdateProductResponse>(`/products/${id}`, { body })
    },
}
