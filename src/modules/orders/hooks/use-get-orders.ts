import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/order.service";

export const ordersQueryKey = ["orders"] as const;

export function useGetOrders() {
    const { data, isError, isLoading } = useQuery({
        queryKey: ordersQueryKey,
        queryFn: () => orderService.list({ page: 1, limit: 10 }),
    })

    return {
        orders: data?.orders ?? [],
        pagination: data?.pagination,
        isLoading,
        isError,
    }
}