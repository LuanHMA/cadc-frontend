import { api } from "../../../shared/lib/api"
import type { Customer, CustomerBody, CustomerDetailsResponse, CustomerMutationResponse, CustomerResponse } from "../contracts/customers-contracts"

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
        console.log(body)
        return api.put<CustomerMutationResponse>(`/customers/${id}`, { body })
    },

    get(id: Customer['id']) {
        return api.get<CustomerDetailsResponse>(`/customers/${id}`)
    },

    delete(id: Customer['id']) {
        return api.delete<CustomerMutationResponse>(`/customers/${id}`)
    },
}
