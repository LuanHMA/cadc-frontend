import { Armchair, Boxes, SearchX, Table2, type LucideIcon } from "lucide-react";
import { currency } from "../../../shared/utils/formatations";
import type { Product } from "../contracts/stock.contracts";
import { UpdateProductPopup } from "./update-product-popup";

const productTypes: Record<Product["id"], { icon: LucideIcon; tone: string }> = {
    TABLE: { icon: Table2, tone: "bg-badge-info-bg text-badge-info-content" },
    CHAIR: { icon: Armchair, tone: "bg-badge-accent-bg text-badge-accent-content" },
    KIT: { icon: Boxes, tone: "bg-badge-success-bg text-badge-success-content" },
}

export function ProductList({ products }: { products: Product[] }) {
    if (products.length === 0) {
        return (
            <div className="w-full p-5 rounded-2xl border border-brd-default bg-background-elevated flex items-center gap-2">
                <SearchX className="size-6 text-content-danger" />
                <p className="text-sm text-content-danger">Nenhum produto encontrado</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
                const { icon: Icon, tone } = productTypes[product.id]
                const units = product.stock === 1 ? "unidade" : "unidades"

                return (
                    <article
                        key={product.id}
                        className={`flex h-full flex-col gap-5 rounded-2xl border border-brd-default bg-background-elevated p-5 [&>button]:mt-auto ${product.id === "CHAIR" ? "order-2" : ""}`}
                    >
                        <div className="flex min-h-14 items-center gap-3">
                            <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                                <Icon className="size-6" strokeWidth={1.75} />
                            </span>
                            <h2 className="text-lg font-semibold tracking-tight text-content-primary">
                                {product.name}
                            </h2>
                        </div>

                        <p className="text-3xl font-semibold tabular-nums tracking-tight text-content-primary">
                            {product.stock}
                            <span className="ml-2 text-sm font-medium text-content-muted">{units}</span>
                        </p>

                        <dl className="space-y-3 border-t border-brd-subtle pt-4">
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-sm text-content-muted">Preço unitário</dt>
                                <dd className="text-base font-medium tabular-nums text-content-primary">
                                    {currency.format(product.unit_price)}
                                </dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-3">
                                <dt className="text-sm text-content-muted">Preço acima de 10 unidades</dt>
                                <dd className={`text-base  tabular-nums ${product.promocional_price ? "text-content-accent font-semibold" : "italic text-content-muted"}`}>
                                    {product.promocional_price ? currency.format(product.promocional_price) : "N/A"}
                                </dd>
                            </div>
                        </dl>

                        <UpdateProductPopup product={product} />
                    </article>
                )
            })}
        </div>
    )
}
