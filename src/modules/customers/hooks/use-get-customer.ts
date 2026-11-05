import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useDebouncedValue } from "../../../shared/components/hooks/use-debounce"
import { customersService } from "../services/customers.service"

export const customersQueryKey = ["customers"] as const

const CUSTOMER_PAGE_SIZE = 10

export function useGetCustomer() {
    const [page, setPage] = useState(1)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const nameQuery = useDebouncedValue(name.trim())
    const phoneQuery = useDebouncedValue(phone.replace(/\D/g, ""))
    const filtersPending = name.trim() !== nameQuery || phone.replace(/\D/g, "") !== phoneQuery

    const { data, isLoading, isError } = useQuery({
        queryKey: [...customersQueryKey, page, nameQuery, phoneQuery],
        enabled: !filtersPending,
        placeholderData: keepPreviousData,
        queryFn: ({ signal }) => customersService.list({
            page,
            limit: CUSTOMER_PAGE_SIZE,
            ...(nameQuery ? { name: nameQuery } : {}),
            ...(phoneQuery ? { phone: phoneQuery } : {}),
        }, signal),
    })

    function updateName(value: string) {
        setName(value)
        setPage(1)
    }

    function updatePhone(value: string) {
        setPhone(value)
        setPage(1)
    }

    return {
        customers: data?.customers ?? [],
        pagination: data?.pagination ?? { page, limit: CUSTOMER_PAGE_SIZE, total: 0, total_pages: 1 },
        isLoading,
        isError,
        page,
        name,
        phone,
        setName: updateName,
        setPhone: updatePhone,
        setPage,
    }
}

