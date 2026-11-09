import { SearchX } from "lucide-react"
import { Pagination } from "../../../shared/components/ui"
import type { Pagination as PaginationInfo } from "../../../shared/types/pagination"
import { formatPhone } from "../../../shared/utils/formatations"
import type { Customer } from "../contracts/customers-contracts"

type CustomersListProps = {
    customers: Customer[]
    pagination: PaginationInfo
    page: number
    onPageChange: (page: number) => void
    isLoading: boolean
    onSelectCustomer: (customerId: Customer["id"]) => void
    selectedCustomer: Customer["id"] | null
    isFiltered: boolean
}

export function CustomersList({
    customers,
    pagination,
    page,
    onPageChange: setPage,
    isLoading,
    onSelectCustomer,
    selectedCustomer,
    isFiltered,
}: CustomersListProps) {
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
                {customers.length === 0 ? (
                    <div className="flex items-center gap-3 border-y border-brd-default p-4">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background-accent/10 text-content-muted">
                            <SearchX className="size-4" />
                        </span>
                        <div className="flex flex-col items-start">
                            <p className="text-sm font-semibold text-content-primary">
                                {isFiltered ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                            </p>
                            <p className="text-sm text-content-muted">
                                {isFiltered ? "Nenhum resultado para essa busca." : "Cadastre um cliente para começar."}
                            </p>
                        </div>
                    </div>
                ) : null}
                {customers.map((customer) => (
                    <div className={`flex items-center justify-between gap-4 p-4 cursor-pointer first:border-t border-t-brd-default border-b border-brd-default  ${selectedCustomer === customer.id ? "bg-background-accent/10" : ""}`} key={customer.id} onClick={() => onSelectCustomer(customer.id)}>
                        <div className=" flex items-center gap-2">
                            <span className="uppercase rounded-full p-2 bg-background-accent/20 text-sm">
                                {customer.name.charAt(0)}{customer.name.charAt(1)}
                            </span>
                            <div className="flex flex-col items-start">
                                <p className="text-sm text-content-primary font-semibold">{customer.name}</p>
                                <p className="text-sm text-content-muted">{formatPhone(customer.phone)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isLoading || customers.length === 0 ? null : (
                <Pagination
                    page={page}
                    totalPages={pagination.total_pages}
                    onPageChange={setPage}
                />
            )}
        </div>

    )
}

function whatsappHref(phone: string) {
    const digits = phone.replace(/\D/g, "")
    const withCountry = digits.startsWith("55") ? digits : `55${digits}`
    return `https://wa.me/${withCountry}`
}

function mapsHref(customer: Customer) {
    const query = [customer.street, customer.house_number, customer.district, "Mesquita - RJ"].filter(Boolean).join(", ")
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
