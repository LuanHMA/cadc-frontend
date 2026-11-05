import { ProductList } from "../../modules/stock/components/product-list"
import { ProductListLoading } from "../../modules/stock/components/product-list-loading"
import { useGetStock } from "../../modules/stock/hooks/use-get-stock"

export function StockPage() {
    const { products, isLoading } = useGetStock()

    return (
        <main className="space-y-4">
            <h1 className="text-2xl font-semibold text-content-primary">Estoque</h1>
            {isLoading ? <ProductListLoading /> : <ProductList products={products} />}
        </main>
    )
}