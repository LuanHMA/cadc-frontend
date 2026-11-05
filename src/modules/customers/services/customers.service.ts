import { api } from "../../../shared/lib/api"
import type { CustomerBody, CustomerMutationResponse, CustomerResponse } from "../contracts/customers-contracts"

export type ListCustomersQuery = {
    page: number
    limit: number
    name?: string
    phone?: string
}

export const customersService = {
    list(query: ListCustomersQuery, signal?: AbortSignal) {
        return api.get<CustomerResponse>("/customers", { query, signal })
    },

    create(body: CustomerBody) {
        return api.post<CustomerMutationResponse>("/customers", { body })
    },

    update(id: string, body: CustomerBody) {
        return api.put<CustomerMutationResponse>(`/customers/${id}`, { body })
    },
}
