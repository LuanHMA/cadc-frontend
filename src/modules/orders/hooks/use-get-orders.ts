import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useDebouncedValue } from "../../../shared/components/hooks/use-debounce"
import type { OrderStatus } from "../contracts/orders-contracts"
import { orderService } from "../services/order.service";

export const ordersQueryKey = ["orders"] as const;

const ORDER_PAGE_SIZE = 10

export function useGetOrders() {
    const [page, setPage] = useState(1)
    const [name, setName] = useState("")
    const [status, setStatus] = useState<OrderStatus | "">("")
    const [deliveryDateFrom, setDeliveryDateFrom] = useState("")
    const [deliveryDateTo, setDeliveryDateTo] = useState("")
    const nameQuery = useDebouncedValue(name.trim())
    const filtersPending = name.trim() !== nameQuery
    const query = {
        page,
        limit: ORDER_PAGE_SIZE,
        ...(nameQuery ? { name: nameQuery } : {}),
        ...(status ? { status } : {}),
        ...(deliveryDateFrom ? { delivery_date_from: deliveryDateFrom } : {}),
        ...(deliveryDateTo ? { delivery_date_to: deliveryDateTo } : {}),
    }

    const { data, isError, isFetching } = useQuery({
        queryKey: [...ordersQueryKey, query],
        enabled: !filtersPending,
        placeholderData: keepPreviousData,
        queryFn: ({ signal }) => orderService.list(query, signal),
    })

    return {
        orders: data?.orders ?? [],
        pagination: data?.pagination ?? { page, limit: ORDER_PAGE_SIZE, total: 0, total_pages: 1 },
        isLoading: isFetching || filtersPending,
        isError,
        page,
        setPage,
        name,
        setName: (value: string) => {
            setName(value)
            setPage(1)
        },
        status,
        setStatus: (value: OrderStatus | "") => {
            setStatus(value)
            setPage(1)
        },
        deliveryDateFrom,
        setDeliveryDateFrom: (value: string) => {
            setDeliveryDateFrom(value)
            setPage(1)
        },
        deliveryDateTo,
        setDeliveryDateTo: (value: string) => {
            setDeliveryDateTo(value)
            setPage(1)
        },
        hasActiveFilters: Boolean(nameQuery || status || deliveryDateFrom || deliveryDateTo),
    }
}