import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useDebouncedValue } from "../../../shared/components/hooks/use-debounce"
import { customersService } from "../services/customers.service"
import { customersQueryKey } from "./use-get-customer"

const CUSTOMER_SEARCH_LIMIT = 10

export function useSearchCustomers(search: string, enabled = true) {
    const term = useDebouncedValue(search.trim())
    const digits = term.replace(/\D/g, "")
    const isPhone = digits.length > 0 && /^[\d\s()+-]+$/.test(term)

    const { data, isFetching, isError } = useQuery({
        queryKey: [...customersQueryKey, "search", term],
        enabled,
        placeholderData: keepPreviousData,
        queryFn: ({ signal }) => customersService.list({
            page: 1,
            limit: CUSTOMER_SEARCH_LIMIT,
            ...(term ? (isPhone ? { phone: digits } : { name: term }) : {}),
        }, signal),
    })

    return {
        customers: data?.customers ?? [],
        isLoading: isFetching || term !== search.trim(),
        isError,
    }
}
