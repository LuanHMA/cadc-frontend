import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { stockService } from "../services/stock.service"

export const stockQueryKey = ["stock"] as const

export function useGetStock() {
    const { data, isLoading, isError } = useQuery({
        queryKey: stockQueryKey,
        queryFn: async () => {
            const response = await stockService.list()
            return response.products
        },
    })

    useEffect(() => {
        if (isError) {
            toast.error("Erro ao buscar produtos")
        }
    }, [isError])

    return {
        products: data ?? [],
        isLoading,
    }
}
