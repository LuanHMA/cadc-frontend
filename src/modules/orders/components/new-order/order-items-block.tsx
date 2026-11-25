import { Minus, Package, Plus, SearchX } from "lucide-react"
import { useController, type Control } from "react-hook-form"
import { Button } from "../../../../shared/components/ui"
import { currency } from "../../../../shared/utils/formatations"
import { productTypes } from "../../../stock/components/product-types"
import type { Product } from "../../../stock/contracts/stock.contracts"
import {
    PROMOTIONAL_MIN_QUANTITY,
    getItemTotal,
    getItemUnitPrice,
    type CreateOrderSchemaType,
} from "../../contracts/orders-contracts"
import { OrderFormSection } from "./order-form-section"

type OrderItemsBlockProps = {
    control: Control<CreateOrderSchemaType>
    products: Product[]
    isLoading: boolean
}

export function OrderItemsBlock({ control, products, isLoading }: OrderItemsBlockProps) {
    const { field, fieldState } = useController({ control, name: "items" })
    const items = field.value ?? []
    const error = fieldState.error?.message ?? fieldState.error?.root?.message

    function quantityOf(productId: Product["id"]) {
        return items.find((item) => item.product_id === productId)?.quantity ?? 0
    }

    function setQuantity(product: Product, quantity: number) {
        const next = Math.min(Math.max(0, Math.floor(quantity) || 0), product.disponible_stock)
        field.onChange(
            products
                .map((current) => ({
                    product_id: current.id,
                    quantity: current.id === product.id ? next : quantityOf(current.id),
                }))
                .filter((item) => item.quantity > 0),
        )
    }

    return (
        <OrderFormSection icon={Package} title="Itens" description="Selecione os itens e as quantidades">
            {isLoading ? (
                <div className="space-y-3" role="status" aria-busy="true" aria-label="Carregando produtos">
                    {Array.from({ length: 3 }, (_, index) => (
                        <div key={index} className="h-20 animate-pulse rounded-xl bg-brd-subtle" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="flex items-center gap-2 rounded-xl border border-brd-default p-4">
                    <SearchX className="size-5 text-content-danger" />
                    <p className="text-sm text-content-danger">Nenhum produto encontrado</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {products.map((product) => (
                        <OrderItemCard
                            key={product.id}
                            product={product}
                            quantity={quantityOf(product.id)}
                            onQuantityChange={(quantity) => setQuantity(product, quantity)}
                        />
                    ))}
                </div>
            )}
            {error ? <p className="text-sm text-content-danger">{error}</p> : null}
        </OrderFormSection>
    )
}

type OrderItemCardProps = {
    product: Product
    quantity: number
    onQuantityChange: (quantity: number) => void
}

function OrderItemCard({ product, quantity, onQuantityChange }: OrderItemCardProps) {
    const { icon: Icon, tone } = productTypes[product.id]
    const unitPrice = getItemUnitPrice(product, quantity)
    const hasPromotion = unitPrice !== product.unit_price
    const unavailable = product.disponible_stock === 0
    const selected = quantity > 0

    return (
        <article
            className={`flex flex-col gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${selected ? "border-brd-accent bg-background-base" : "border-brd-default"} ${unavailable ? "opacity-60" : ""}`}
        >
            <div className="flex min-w-0 items-center gap-3">
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                    <Icon className="size-6" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-content-primary">{product.name}</h3>
                    <p className="text-sm text-content-muted">
                        <span className={hasPromotion ? "line-through" : "font-medium text-content-primary"}>
                            {currency.format(product.unit_price)}
                        </span>
                        {hasPromotion ? (
                            <span className="ml-1 font-semibold text-content-accent">{currency.format(unitPrice)}</span>
                        ) : null}
                        <span> / un.</span>
                        {product.id !== "KIT" && product.promocional_price != null && !hasPromotion ? (
                            <span className="ml-1">
                                · {currency.format(product.promocional_price)} acima de {PROMOTIONAL_MIN_QUANTITY} un.
                            </span>
                        ) : null}
                    </p>
                    <p className={`text-sm ${unavailable ? "text-content-danger" : "text-content-muted"}`}>
                        {unavailable ? "Sem estoque disponível" : `${product.disponible_stock} disponíveis`}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label={`Remover ${product.name}`}
                        leftIcon={<Minus />}
                        disabled={quantity === 0}
                        onClick={() => onQuantityChange(quantity - 1)}
                    />
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={product.disponible_stock}
                        aria-label={`Quantidade de ${product.name}`}
                        value={quantity}
                        disabled={unavailable}
                        onFocus={(event) => event.target.select()}
                        onChange={(event) => onQuantityChange(Number(event.target.value))}
                        className="h-8 w-14 rounded-md border border-input-border bg-input-bg text-center text-sm font-semibold tabular-nums text-input-content outline-none focus:border-input-focus-border focus:ring-2 focus:ring-input-focus-ring disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label={`Adicionar ${product.name}`}
                        leftIcon={<Plus />}
                        disabled={quantity >= product.disponible_stock}
                        onClick={() => onQuantityChange(quantity + 1)}
                    />
                </div>
                <div className="w-28 text-right">
                    <p className="text-xs text-content-muted">Total</p>
                    <p className={`text-base font-semibold tabular-nums ${selected ? "text-content-primary" : "text-content-muted"}`}>
                        {currency.format(getItemTotal(product, quantity))}
                    </p>
                </div>
            </div>
        </article>
    )
}
