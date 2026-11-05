import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { getApiErrorMessage } from "../../../shared/lib/api"
import { CustomerFormSchema, emptyCustomerForm, toCustomerBody, type CustomerBody, type CustomerFormSchemaType } from "../contracts/customers-contracts"
import { customersService } from "../services/customers.service"
import { customersQueryKey } from "./use-get-customer"

export function useCreateCustomer(onCreated: () => void) {
    const queryClient = useQueryClient()

    const { handleSubmit, control, reset, formState: { isSubmitting } } = useForm<CustomerFormSchemaType>({
        resolver: zodResolver(CustomerFormSchema),
        defaultValues: emptyCustomerForm,
    })

    const { mutateAsync } = useMutation({
        mutationFn: (body: CustomerBody) => customersService.create(body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: customersQueryKey }),
    })

    const onCreate = async (data: CustomerFormSchemaType) => {
        try {
            const response = await mutateAsync(toCustomerBody(data))
            toast.success(response.message)
            reset(emptyCustomerForm)
            onCreated()
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Não foi possível criar o cliente."))
        }
    }

    return {
        handleSubmit,
        control,
        isSubmitting,
        onCreate,
    }
}
