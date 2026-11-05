import { Button } from "../../../shared/components/ui"
import type { Customer } from "../contracts/customers-contracts"
import { useUpdateCustomer } from "../hooks/use-update-customer"
import { CustomerFormFields } from "./customer-form-fields"

export function UpdateCustomerForm({ customer, onClose }: { customer: Customer, onClose: () => void }) {
    const { handleSubmit, control, onUpdate, isSubmitting } = useUpdateCustomer(customer, onClose)

    return (
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onUpdate)}>
            <CustomerFormFields control={control} />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" loading={isSubmitting}>Salvar</Button>
            </div>
        </form>
    )
}
