import { Button } from "../../../shared/components/ui"
import { useCreateCustomer } from "../hooks/use-create-customer"
import { CustomerFormFields } from "./customer-form-fields"

export function CreateCustomerForm({ onClose }: { onClose: () => void }) {
    const { handleSubmit, control, onCreate, isSubmitting } = useCreateCustomer(onClose)

    return (
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onCreate)}>
            <CustomerFormFields control={control} />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" loading={isSubmitting}>Salvar</Button>
            </div>
        </form>
    )
}
