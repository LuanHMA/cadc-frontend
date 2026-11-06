import { Search, SearchX } from "lucide-react"
import { Input, Pagination } from "../../../shared/components/ui"
import type { Pagination as PaginationInfo } from "../../../shared/types/pagination"
import type { Customer } from "../contracts/customers-contracts"
import { CustomersListLoading } from "./customers-list-loading"

type CustomersListProps = {
    customers: Customer[]
    pagination: PaginationInfo
    page: number
    name: string
    phone: string
    onNameChange: (value: string) => void
    onPhoneChange: (value: string) => void
    onPageChange: (page: number) => void
    isLoading: boolean
}

export function CustomersList({
    customers,
    pagination,
    page,
    name,
    phone,
    onNameChange,
    onPhoneChange,
    onPageChange,
    isLoading,
}: CustomersListProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-xl">
                <Input
                    type="search"
                    label="Nome"
                    placeholder="Buscar por nome"
                    value={name}
                    leftIcon={<Search />}
                    onChange={(event) => onNameChange(event.target.value)}
                />
                <Input
                    type="search"
                    label="Telefone"
                    placeholder="Buscar por telefone"
                    inputMode="tel"
                    value={phone}
                    leftIcon={<Search />}
                    onChange={(event) => onPhoneChange(event.target.value)}
                />
            </div>

            {isLoading ? <CustomersListLoading /> : customers.length === 0 ? (
                <div className="flex w-full items-center gap-2 rounded-2xl border border-brd-default bg-background-elevated p-5">
                    <SearchX className="size-6 text-content-warning" />
                    <p className="text-sm text-content-warning">Nenhum cliente cadastrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
               
                </div>
            )}

            {isLoading ? null : (
                <Pagination
                    page={page}
                    totalPages={pagination.total_pages}
                    onPageChange={onPageChange}
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
