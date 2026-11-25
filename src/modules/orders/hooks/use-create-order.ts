import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { getApiErrorMessage } from "../../../shared/lib/api"
import type { Customer } from "../../customers/contracts/customers-contracts"
import { stockQueryKey } from "../../stock/hooks/use-get-stock"
import { CreateOrderSchema, emptyOrderForm, type CreateOrderSchemaType } from "../contracts/orders-contracts"
import { orderService } from "../services/order.service"

export const ordersQueryKey = ["orders"] as const

export function useCreateOrder() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

    const { handleSubmit, control, setValue, formState: { isSubmitting } } = useForm<CreateOrderSchemaType>({
        resolver: zodResolver(CreateOrderSchema),
        defaultValues: emptyOrderForm,
    })

    const { mutateAsync } = useMutation({
        mutationFn: (body: CreateOrderSchemaType) => orderService.create(body),
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
            queryClient.invalidateQueries({ queryKey: stockQueryKey }),
        ]),
    })

    const selectCustomer = (customer: Customer | null) => {
        setSelectedCustomer(customer)
        setValue("customer_id", customer?.id ?? "", { shouldValidate: customer !== null, shouldDirty: true })
    }

    const onCreate = async (data: CreateOrderSchemaType) => {
        try {
            await mutateAsync(data)
            toast.success("Pedido criado com sucesso")
            navigate("/pedidos")
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Não foi possível criar o pedido."))
        }
    }

    return {
        handleSubmit,
        control,
        isSubmitting,
        onCreate,
        selectedCustomer,
        selectCustomer,
    }
}
