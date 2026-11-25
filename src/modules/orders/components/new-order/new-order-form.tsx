import { useGetStock } from "../../../stock/hooks/use-get-stock"
import { useCreateOrder } from "../../hooks/use-create-order"
import { OrderCustomerBlock } from "./order-customer-block"
import { OrderDatesBlock } from "./order-dates-block"
import { OrderItemsBlock } from "./order-items-block"
import { OrderPaymentBlock } from "./order-payment-block"
import { OrderSummary } from "./order-summary"

export function NewOrderForm() {
    const { handleSubmit, control, onCreate, isSubmitting, selectedCustomer, selectCustomer } = useCreateOrder()
    const { products, isLoading: isLoadingProducts } = useGetStock()

    return (
        <form
            className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_auto]"
            onSubmit={handleSubmit(onCreate)}
        >
            <div className="space-y-4">
                <OrderCustomerBlock control={control} selectedCustomer={selectedCustomer} onSelectCustomer={selectCustomer} />
                <OrderDatesBlock control={control} />
                <OrderItemsBlock control={control} products={products} isLoading={isLoadingProducts} />
                <OrderPaymentBlock control={control} />
            </div>

            <OrderSummary control={control} customer={selectedCustomer} products={products} isSubmitting={isSubmitting} />
        </form>
    )
}
