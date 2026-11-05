import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { getApiErrorMessage } from "../../../shared/lib/api"
import { UpdateProductSchema, type Product, type UpdateProductBody, type UpdateProductFormValues, type UpdateProductSchemaType } from "../contracts/stock.contracts"
import { stockService } from "../services/stock.service"
import { stockQueryKey } from "./use-get-stock"

export function useUpdateStock(product: Product, onUpdated: () => void) {
    const queryClient = useQueryClient()

    const { handleSubmit, control, formState: { isSubmitting } } = useForm<UpdateProductFormValues, unknown, UpdateProductSchemaType>({
        resolver: zodResolver(UpdateProductSchema),
        defaultValues: {
            name: product.name,
            stock: product.stock,
            unit_price: product.unit_price,
            promocional_price: product.promocional_price,
        },
    })

    const { mutateAsync } = useMutation({
        mutationFn: (data: UpdateProductSchemaType) => stockService.update(product.id, toUpdateProductBody(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: stockQueryKey }),
    })

    const onUpdate = async (data: UpdateProductSchemaType) => {
        try {
            const response = await mutateAsync(data)
            toast.success(response.message)
            onUpdated()
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Não foi possível atualizar o produto."))
        }
    }

    return {
        handleSubmit,
        control,
        isSubmitting,
        onUpdate,
    }
}

function toUpdateProductBody(data: UpdateProductSchemaType): UpdateProductBody {
    return {
        name: data.name,
        stock: data.stock,
        unit_price: data.unit_price,
        ...(data.promocional_price == null ? {} : { promocional_price: data.promocional_price }),
    }
}
