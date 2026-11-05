import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { getApiErrorMessage } from "../../../shared/lib/api"
import { CustomerFormSchema, customerFormValues, toCustomerBody, type Customer, type CustomerBody, type CustomerFormSchemaType } from "../contracts/customers-contracts"
import { customersService } from "../services/customers.service"
import { customersQueryKey } from "./use-get-customer"

export function useUpdateCustomer(customer: Customer, onUpdated: () => void) {
    const queryClient = useQueryClient()

    const { handleSubmit, control, formState: { isSubmitting } } = useForm<CustomerFormSchemaType>({
        resolver: zodResolver(CustomerFormSchema),
        defaultValues: customerFormValues(customer),
    })

    const { mutateAsync } = useMutation({
        mutationFn: (body: CustomerBody) => customersService.update(customer.id, body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: customersQueryKey }),
    })

    const onUpdate = async (data: CustomerFormSchemaType) => {
        try {
            const response = await mutateAsync(toCustomerBody(data))
            toast.success(response.message)
            onUpdated()
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Não foi possível atualizar o cliente."))
        }
    }

    return {
        handleSubmit,
        control,
        isSubmitting,
        onUpdate,
    }
}
