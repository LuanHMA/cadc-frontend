import z from "zod"
import type { Pagination } from "../../../shared/types/pagination"
import { phoneDigits } from "../../../shared/utils/formatations"

export type Customer = {
    id: string
    name: string
    phone: string
    street: string
    district: string
    house_number: string
    complement: string | null
    created_at: string
    updated_at: string
}

export type CustomerResponse = {
    customers: Customer[],
    pagination: Pagination
    message: string
}

export const CustomerFormSchema = z.object({
    name: z.string("Nome é obrigatório").trim().min(1, "Nome é obrigatório").max(255, "Nome deve ter no máximo 255 caracteres"),
    phone: z.string("Telefone é obrigatório").trim().min(1, "Telefone é obrigatório").refine((value) => {
        const digits = phoneDigits(value)
        return digits.length >= 10 && digits.length <= 11
    }, "Telefone inválido"),
    street: z.string("Selecione uma rua de Mesquita").trim().min(1, "Selecione uma rua de Mesquita").max(220, "Rua deve ter no máximo 220 caracteres"),
    house_number: z.string("Número é obrigatório").trim().min(1, "Número é obrigatório").max(10, "Número deve ter no máximo 10 caracteres"),
    district: z.string("Bairro é obrigatório").trim().min(1, "Selecione uma rua de Mesquita").max(255, "Bairro deve ter no máximo 255 caracteres"),
    complement: z.string().trim().max(255, "Ponto de referência deve ter no máximo 255 caracteres"),
})

export type CustomerFormSchemaType = z.infer<typeof CustomerFormSchema>

export type CustomerBody = {
    name: string
    phone: string
    street: string
    district: string
    house_number: string
    complement: string | null
}

export type CustomerMutationResponse = {
    message: string
    customer?: Customer
}

export const emptyCustomerForm: CustomerFormSchemaType = {
    name: "",
    phone: "",
    street: "",
    house_number: "",
    district: "",
    complement: "",
}

export function customerFormValues(customer: Customer): CustomerFormSchemaType {
    return {
        name: customer.name,
        phone: customer.phone,
        street: customer.street,
        house_number: customer.house_number,
        district: customer.district,
        complement: customer.complement ?? "",
    }
}

export function toCustomerBody(data: CustomerFormSchemaType): CustomerBody {
    return {
        name: data.name,
        phone: phoneDigits(data.phone),
        street: data.street,
        district: data.district,
        house_number: data.house_number,
        complement: data.complement || null,
    }
}