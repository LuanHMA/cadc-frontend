import { Button, Input } from "../../../shared/components/ui"
import { CurrencyInput } from "../../../shared/components/ui/currency-input"
import type { Product } from "../contracts/stock.contracts"
import { useUpdateStock } from "../hooks/use-update-stock"

export function UpdateProductForm({ product, onClose }: { product: Product, onClose: () => void }) {
    const { handleSubmit, control, onUpdate, isSubmitting } = useUpdateStock(product, onClose)

    return (
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onUpdate)}>
            <Input type="number" label="Quantidade" placeholder="Quantidade" control={control} name="stock" min={0} step={1} />
            <CurrencyInput control={control} name="unit_price" label="Preço unitário" />
            <CurrencyInput control={control} name="promocional_price" label="Preço promocional" />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" loading={isSubmitting}>Salvar</Button>
            </div>
        </form>
    )
}
