import { MapPin, MessageCircle, Search, SearchX, User } from "lucide-react"
import { Input, Pagination } from "../../../shared/components/ui"
import type { Pagination as PaginationInfo } from "../../../shared/types/pagination"
import { formatPhone } from "../../../shared/utils/formatations"
import type { Customer } from "../contracts/customers-contracts"
import { CustomersListLoading } from "./customers-list-loading"
import { UpdateCustomerPopup } from "./update-customer-popup"

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
                    {customers.map((customer) => (
                        <article
                            key={customer.id}
                            className="flex h-full flex-col gap-5 rounded-2xl border border-brd-default bg-background-elevated p-5"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-badge-accent-bg text-badge-accent-content">
                                        <User className="size-5" strokeWidth={1.75} />
                                    </span>
                                    <h2 className="min-w-0 truncate text-base font-semibold tracking-tight text-content-primary">
                                        {customer.name}
                                    </h2>
                                </div>
                                <UpdateCustomerPopup customer={customer} />
                            </div>

                            <dl className="space-y-3 border-t border-brd-subtle pt-4">
                                <div className="flex items-baseline justify-between gap-3">
                                    <dt className="text-sm text-content-muted">Telefone</dt>
                                    <dd className="text-sm font-medium tabular-nums text-content-primary">
                                        {formatPhone(customer.phone)}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <dt className="text-sm text-content-muted">Endereço</dt>
                                    <dd className="text-right text-sm font-medium text-content-primary">
                                        {customer.street}, {customer.house_number}
                                    </dd>
                                </div>
                                <div className="flex items-baseline justify-between gap-3">
                                    <dt className="text-sm text-content-muted">Bairro</dt>
                                    <dd className="text-right text-sm font-medium text-content-primary">
                                        {customer.district}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <dt className="text-sm text-content-muted">Referência</dt>
                                    <dd className={`text-right text-sm ${customer.complement ? "font-medium text-content-primary" : "italic text-content-muted"}`}>
                                        {customer.complement || "N/A"}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-auto flex gap-2">
                                <a
                                    href={whatsappHref(customer.phone)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-btn-primary-bg px-3 text-sm font-medium text-btn-primary-content transition-colors hover:bg-btn-primary-hover-bg"
                                >
                                    <MessageCircle className="size-4" />
                                    WhatsApp
                                </a>
                                <a
                                    href={mapsHref(customer)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-btn-outline-border bg-btn-outline-bg px-3 text-sm font-medium text-btn-outline-content transition-colors hover:bg-btn-outline-hover-bg hover:text-btn-outline-hover-content"
                                >
                                    <MapPin className="size-4" />
                                    Mapa
                                </a>
                            </div>
                        </article>
                    ))}
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
