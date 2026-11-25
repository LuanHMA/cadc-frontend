import { Button } from "../../../shared/components/ui"
import type { Customer } from "../contracts/customers-contracts"
import { useCreateCustomer } from "../hooks/use-create-customer"
import { CustomerFormFields } from "./customer-form-fields"

type CreateCustomerFormProps = {
    onClose: () => void
    onCreated?: (customer: Customer) => void
}

export function CreateCustomerForm({ onClose, onCreated }: CreateCustomerFormProps) {
    const { handleSubmit, control, onCreate, isSubmitting } = useCreateCustomer((customer) => {
        if (customer) onCreated?.(customer)
        onClose()
    })

    return (
        <form
            className="mt-4 space-y-4"
            onSubmit={(event) => {
                // React propagates submit through portals, so a parent form would also submit.
                event.stopPropagation()
                handleSubmit(onCreate)(event)
            }}
        >
            <CustomerFormFields control={control} />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" loading={isSubmitting}>Salvar</Button>
            </div>
        </form>
    )
}
