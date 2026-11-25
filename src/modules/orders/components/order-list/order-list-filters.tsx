import { Search } from "lucide-react"
import { Input, Select } from "../../../../shared/components/ui"
import type { OrderStatus } from "../../contracts/orders-contracts"
import { orderStatusLabels } from "./order-status-labels"

const selectableStatuses: OrderStatus[] = [
    "PENDING_DELIVERY",
    "PENDING_PICKUP",
    "DELIVERED",
    "CANCELLED",
    "COMPLETED",
]
const statusOptions = [
    { value: "ALL", label: "Todos os status" },
    ...selectableStatuses.map((value) => ({ value, label: orderStatusLabels[value] })),
]

type OrderListFiltersProps = {
    name: string
    status: OrderStatus | ""
    deliveryDateFrom: string
    deliveryDateTo: string
    onNameChange: (value: string) => void
    onStatusChange: (value: OrderStatus | "") => void
    onDeliveryDateFromChange: (value: string) => void
    onDeliveryDateToChange: (value: string) => void
    }

export function OrderListFilters({
    name,
    status,
    deliveryDateFrom,
    deliveryDateTo,
    onNameChange,
    onStatusChange,
    onDeliveryDateFromChange,
    onDeliveryDateToChange,
}: OrderListFiltersProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Input
                type="search"
                label="Cliente"
                placeholder="Buscar por nome do cliente"
                value={name}
                leftIcon={<Search />}
                onChange={(event) => onNameChange(event.target.value)}
            />
            <Select
                label="Status"
                value={status || "ALL"}
                options={statusOptions}
                onChange={(value) => onStatusChange(value === "ALL" ? "" : value as OrderStatus)}
            />
            <DateRangeFilter
                label="Período de entrega"
                from={deliveryDateFrom}
                to={deliveryDateTo}
                onFromChange={onDeliveryDateFromChange}
                onToChange={onDeliveryDateToChange}
                fromLabel="Data inicial da entrega"
                toLabel="Data final da entrega"
            />
        </div>
    )
}

type DateRangeFilterProps = {
    label: string
    from: string
    to: string
    onFromChange: (value: string) => void
    onToChange: (value: string) => void
    fromLabel: string
    toLabel: string
}

function DateRangeFilter({
    label,
    from,
    to,
    onFromChange,
    onToChange,
    fromLabel,
    toLabel,
}: DateRangeFilterProps) {
    return (
        <fieldset className="min-w-0 space-y-1">
            <legend className="text-sm font-medium text-content-primary">{label}</legend>
            <div className="grid grid-cols-2 gap-2">
                <Input
                    type="date"
                    aria-label={fromLabel}
                    value={from}
                    max={to || undefined}
                    onChange={(event) => onFromChange(event.target.value)}
                />
                <Input
                    type="date"
                    aria-label={toLabel}
                    value={to}
                    min={from || undefined}
                    onChange={(event) => onToChange(event.target.value)}
                />
            </div>
        </fieldset>
    )
}
