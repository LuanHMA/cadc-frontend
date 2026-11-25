import { CheckCircle2, ReceiptText } from "lucide-react"
import { useWatch, type Control } from "react-hook-form"
import { Button } from "../../../../shared/components/ui"
import { currency, formatDateOnly } from "../../../../shared/utils/formatations"
import type { Customer } from "../../../customers/contracts/customers-contracts"
import type { Product } from "../../../stock/contracts/stock.contracts"
import { getItemTotal, getItemUnitPrice, paymentMethodLabels, type CreateOrderSchemaType } from "../../contracts/orders-contracts"

type OrderSummaryProps = {
    control: Control<CreateOrderSchemaType>
    customer: Customer | null
    products: Product[]
    isSubmitting: boolean
}

export function OrderSummary({ control, customer, products, isSubmitting }: OrderSummaryProps) {
    const [deliveryDate, pickupDate, paymentMethod, items = []] = useWatch({
        control,
        name: ["delivery_date", "pickup_date", "payment_method", "items"],
    })

    const lines = items.flatMap((item) => {
        const product = products.find((current) => current.id === item.product_id)
        if (!product) return []
        return [{
            product,
            qtd: item.qtd,
            promotional: getItemUnitPrice(product, item.qtd) !== product.unit_price,
            total: getItemTotal(product, item.qtd),
        }]
    })
    const total = lines.reduce((sum, line) => sum + line.total, 0)

    return (
        <aside className="w-full space-y-4 rounded-2xl border border-brd-default bg-background-elevated p-5 lg:sticky lg:top-0 lg:w-80">
            <h2 className="flex items-center gap-2 border-b border-brd-subtle pb-4 text-base font-semibold text-content-primary">
                <ReceiptText className="size-5 text-content-accent" />
                Resumo do pedido
            </h2>

            <dl className="space-y-3 text-sm">
                <SummaryRow label="Cliente" value={customer?.name} />
                <SummaryRow label="Entrega" value={deliveryDate ? formatDateOnly(deliveryDate) : undefined} />
                <SummaryRow label="Recolhimento" value={pickupDate ? formatDateOnly(pickupDate) : undefined} />
                <SummaryRow label="Pagamento" value={paymentMethod ? paymentMethodLabels[paymentMethod] : undefined} />
            </dl>

            <div className="space-y-2 border-t border-brd-subtle pt-4">
                <p className="text-sm font-medium text-content-muted">Itens</p>
                {lines.length === 0 ? (
                    <p className="text-sm italic text-content-muted">Nenhum item selecionado</p>
                ) : (
                    <ul className="space-y-2">
                        {lines.map((line) => (
                            <li key={line.product.id} className="flex items-baseline justify-between gap-3 text-sm">
                                <span className="text-content-primary">
                                    <span className="font-semibold tabular-nums">{line.qtd}x</span> {line.product.name}
                                    {line.promotional ? <span className="ml-1 text-xs text-content-accent">(promo)</span> : null}
                                </span>
                                <span className="font-medium tabular-nums text-content-primary">{currency.format(line.total)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex items-baseline justify-between gap-3 border-t border-brd-subtle pt-4">
                <span className="text-sm font-medium text-content-muted">Total</span>
                <span className="text-2xl font-semibold tabular-nums tracking-tight text-content-primary">
                    {currency.format(total)}
                </span>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting} leftIcon={<CheckCircle2 />}>
                Confirmar pedido
            </Button>
        </aside>
    )
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex items-baseline justify-between gap-3">
            <dt className="text-content-muted">{label}</dt>
            <dd className={`truncate text-right ${value ? "font-medium text-content-primary" : "text-content-muted"}`}>
                {value ?? "—"}
            </dd>
        </div>
    )
}
