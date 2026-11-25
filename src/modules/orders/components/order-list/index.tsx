import { useGetOrders } from "../../hooks/use-get-orders"

export function OrderList() {
    const { orders, pagination, isLoading, isError } = useGetOrders()

    console.log(orders)

    return (
        <div>
            {orders.length && orders.map((order) => (
                <div key={order.id}>
                    <p>Order ID: {order.id}</p>
                    <p>Customer Name: {order.customer.name}</p>
                    <p>Total Amount: {order.total_price}</p>
                </div>
            ))}
        </div>
    )
}