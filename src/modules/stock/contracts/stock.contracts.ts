import z from "zod"

export interface StockResponse {
    products: Product[]
    message: string
}

export type Product = {
    id: "TABLE" | "CHAIR" | "KIT"
    name: string
    promocional_price: number | null
    unit_price: number
    stock: number
    created_at: string
    updated_at: string
}

const requiredNumber = (schema: z.ZodNumber) =>
    z.preprocess(
        (value) => (typeof value === "string" && value.trim() !== "" ? Number(value) : value),
        schema,
    )

export const UpdateProductSchema = z.object({
    name: z.string("Nome é obrigatório").trim().min(1, "Nome é obrigatório").max(255, "Nome deve ter no máximo 255 caracteres"),
    stock: requiredNumber(
        z.number("Quantidade é obrigatória").int("Quantidade deve ser um número inteiro").min(0, "Quantidade não pode ser negativa"),
    ),
    unit_price: z.number("Preço unitário é obrigatório").min(0, "Preço unitário não pode ser negativo"),
    promocional_price: z.number("Preço promocional inválido").min(0, "Preço promocional não pode ser negativo").nullable(),
})

export type UpdateProductBody = {
    name?: string
    stock?: number
    unit_price?: number
    promocional_price?: number
}

export type UpdateProductSchemaType = z.output<typeof UpdateProductSchema>
export type UpdateProductFormValues = z.input<typeof UpdateProductSchema>

export type UpdateProductResponse = {
    message: string
    products?: Product[]
}
