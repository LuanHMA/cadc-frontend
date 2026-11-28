import { MapPin, Phone, Search, User, UserPlus } from "lucide-react"
import { useState, type KeyboardEvent } from "react"
import { useController, type Control } from "react-hook-form"
import { Button, Input } from "../../../../shared/components/ui"
import { formatPhone } from "../../../../shared/utils/formatations"
import { CreateCustomerPopup } from "../../../customers/components/create-customer-popup"
import type { Customer } from "../../../customers/contracts/customers-contracts"
import { useSearchCustomers } from "../../../customers/hooks/use-search-customers"
import type { CreateOrderSchemaType } from "../../contracts/orders-contracts"
import { OrderFormSection } from "./order-form-section"

type OrderCustomerBlockProps = {
    control: Control<CreateOrderSchemaType>
    selectedCustomer: Customer | null
    onSelectCustomer: (customer: Customer | null) => void
}

export function OrderCustomerBlock({ control, selectedCustomer, onSelectCustomer }: OrderCustomerBlockProps) {
    const { field, fieldState } = useController({ control, name: "customer_id" })
    const [query, setQuery] = useState(selectedCustomer?.name ?? "")
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const search = selectedCustomer && query === selectedCustomer.name ? "" : query
    const { customers, isLoading, isError } = useSearchCustomers(search, open)

    function selectCustomer(customer: Customer) {
        setQuery(customer.name)
        setOpen(false)
        onSelectCustomer(customer)
    }

    function onQueryChange(value: string) {
        setQuery(value)
        setOpen(true)
        setActiveIndex(0)
        if (selectedCustomer) onSelectCustomer(null)
    }

    function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (!open || customers.length === 0) return

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setActiveIndex((index) => (index + 1) % customers.length)
        } else if (event.key === "ArrowUp") {
            event.preventDefault()
            setActiveIndex((index) => (index - 1 + customers.length) % customers.length)
        } else if (event.key === "Enter") {
            event.preventDefault()
            const customer = customers[activeIndex]
            if (customer) selectCustomer(customer)
        } else if (event.key === "Escape") {
            setOpen(false)
        }
    }

    return (
        <OrderFormSection
            icon={User}
            title="Cliente"
            description="Busque pelo nome ou celular"
            action={(
                <CreateCustomerPopup
                    onCreated={selectCustomer}
                    trigger={(
                        <Button type="button" variant="outline" size="sm" leftIcon={<UserPlus />}>
                            Cadastrar cliente
                        </Button>
                    )}
                />
            )}
        >
            <div className="relative">
                <Input
                    error={fieldState.error?.message}
                    type="search"
                    role="combobox"
                    aria-expanded={open}
                    aria-autocomplete="list"
                    placeholder="Ex: Maria ou (21) 99999-9999"
                    autoComplete="off"
                    leftIcon={<Search />}
                    value={query}
                    onFocus={(event) => {
                        event.target.select()
                        setOpen(true)
                    }}
                    onBlur={() => {
                        field.onBlur()
                        setOpen(false)
                    }}
                    onKeyDown={onKeyDown}
                    onChange={(event) => onQueryChange(event.target.value)}
                />
                {open ? (
                    <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto  rounded-xl border border-brd-default bg-background-elevated ">
                        {isError ? (
                            <p className="px-3 py-2 text-sm text-content-danger">Não foi possível buscar os clientes.</p>
                        ) : customers.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-content-muted">
                                {isLoading ? "Buscando clientes..." : "Nenhum cliente encontrado."}
                            </p>
                        ) : (
                            <ul role="listbox">
                                {customers.map((customer, index) => (
                                    <li key={customer.id} role="option" aria-selected={customer.id === field.value}>
                                        <button
                                            type="button"
                                            className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-background-base ${index === activeIndex ? "bg-background-base" : ""}`}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onClick={() => selectCustomer(customer)}
                                        >
                                            <span className="truncate text-sm font-medium text-content-primary">{customer.name}</span>
                                            <span className="shrink-0 text-sm tabular-nums text-content-muted">{formatPhone(customer.phone)}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : null}
            </div>

            {selectedCustomer ? <SelectedCustomerInfo customer={selectedCustomer} /> : null}
        </OrderFormSection>
    )
}

function SelectedCustomerInfo({ customer }: { customer: Customer }) {
    return (
        <div className="grid grid-cols-1 gap-3  rounded-xl border border-brd-default bg-background-base p-4 md:grid-cols-3">
            <div className="flex items-start gap-2">
                <User className="mt-0.5 size-4 shrink-0 text-content-muted" />
                <div className="min-w-0">
                    <p className="text-xs font-medium text-content-muted">Nome</p>
                    <p className="truncate text-sm font-medium text-content-primary">{customer.name}</p>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-content-muted" />
                <div>
                    <p className="text-xs font-medium text-content-muted">Telefone</p>
                    <p className="text-sm font-medium tabular-nums text-content-primary">{formatPhone(customer.phone)}</p>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-content-muted" />
                <div className="min-w-0">
                    <p className="text-xs font-medium text-content-muted">Endereço</p>
                    <p className="text-sm font-medium text-content-primary">
                        {customer.street}, {customer.house_number} - {customer.district}
                    </p>
                    {customer.complement ? <p className="text-sm text-content-muted">{customer.complement}</p> : null}
                </div>
            </div>
        </div>
    )
}
