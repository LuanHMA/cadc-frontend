import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Minus, Plus, Search } from "lucide-react"
import { useState, type KeyboardEvent } from "react"
import { useController, useForm, useWatch, type Control } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, Input, Select, Textarea, type SelectOption } from "../../../../shared/components/ui"
import { getApiErrorMessage } from "../../../../shared/lib/api"
import type { Customer } from "../../../customers/contracts/customers-contracts"
import { useSearchCustomers } from "../../../customers/hooks/use-search-customers"
import { useGetStock, stockQueryKey } from "../../../stock/hooks/use-get-stock"
import type { ItemType, Order, OrderStatus, UpdateOrderSchemaType } from "../../contracts/orders-contracts"
import { paymentMethodLabels, UpdateOrderSchema } from "../../contracts/orders-contracts"
import { ordersQueryKey } from "../../hooks/use-get-orders"
import { orderService } from "../../services/order.service"
import { orderStatusLabels } from "./order-status-labels"

const paymentOptions: SelectOption[] = [
    { value: "CASH", label: paymentMethodLabels.CASH },
    { value: "PIX", label: paymentMethodLabels.PIX },
    { value: "CREDIT_CARD", label: paymentMethodLabels.CREDIT_CARD },
    { value: "DEBIT_CARD", label: paymentMethodLabels.DEBIT_CARD },
    { value: "OTHER", label: paymentMethodLabels.OTHER },
]

const statuses: OrderStatus[] = [
    "PENDING_DELIVERY",
    "PENDING_PICKUP",
    "DELIVERED",
    "CANCELLED",
    "COMPLETED",
]
const statusOptions: SelectOption[] = statuses.map((value) => ({
    value,
    label: orderStatusLabels[value],
}))

const itemOptions: { id: ItemType; fallbackName: string }[] = [
    { id: "TABLE", fallbackName: "Mesa" },
    { id: "CHAIR", fallbackName: "Cadeira" },
    { id: "KIT", fallbackName: "Kit" },
]

type UpdateOrderFormProps = {
    order: Order
    onClose: () => void
    onUpdated: () => void
}

export function UpdateOrderForm({ order, onClose, onUpdated }: UpdateOrderFormProps) {
    const queryClient = useQueryClient()
    const { products, isLoading: isLoadingProducts } = useGetStock()
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(order.customer)
    const [customerQuery, setCustomerQuery] = useState(order.customer.name)
    const { handleSubmit, control, setValue, formState: { isSubmitting, errors } } = useForm<UpdateOrderSchemaType>({
        resolver: zodResolver(UpdateOrderSchema),
        defaultValues: orderFormValues(order),
    })
    const items = useWatch({ control, name: "items" }) ?? []

    const { mutateAsync } = useMutation({
        mutationFn: (body: UpdateOrderSchemaType) => orderService.update(order.id, body),
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
            queryClient.invalidateQueries({ queryKey: stockQueryKey }),
        ]),
    })

    async function onSubmit(data: UpdateOrderSchemaType) {
        try {
            await mutateAsync(data)
            toast.success("Pedido atualizado com sucesso")
            onClose()
            onUpdated()
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Não foi possível atualizar o pedido."))
        }
    }

    function quantityOf(productId: ItemType) {
        return items.find((item) => item.product_id === productId)?.qtd ?? 0
    }

    function setQuantity(productId: ItemType, quantity: number) {
        const availableStock = products.find((product) => product.id === productId)?.disponible_stock ?? 0
        const currentOrderQuantity = order.items.find((item) => item.type === productId)?.quantity ?? 0
        const maxQuantity = availableStock + currentOrderQuantity
        const nextQuantity = Math.min(maxQuantity, Math.max(0, Math.floor(quantity) || 0))
        const nextItems = items.filter((item) => item.product_id !== productId)

        if (nextQuantity > 0) nextItems.push({ product_id: productId, qtd: nextQuantity })
        setValue("items", nextItems, { shouldDirty: true, shouldValidate: true })
    }

    return (
        <form className="mt-4 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <CustomerPicker
                control={control}
                selectedCustomer={selectedCustomer}
                customerQuery={customerQuery}
                onQueryChange={(value) => {
                    setCustomerQuery(value)
                    setSelectedCustomer(null)
                }}
                onSelect={(customer) => {
                    setSelectedCustomer(customer)
                    setCustomerQuery(customer.name)
                }}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input type="date" label="Data de entrega" control={control} name="delivery_date" />
                <Input type="date" label="Data de retirada" control={control} name="pickup_date" />
                <Select label="Status" control={control} name="status" options={statusOptions} />
                <Select label="Forma de pagamento" control={control} name="payment_method" options={paymentOptions} />
            </div>

            <fieldset className="space-y-3 rounded-xl border border-brd-default p-4">
                <legend className="px-1 text-sm font-semibold text-content-primary">Itens do pedido</legend>
                {isLoadingProducts ? (
                    <p className="text-sm text-content-muted" role="status">Carregando estoque...</p>
                ) : products.length === 0 ? (
                    <p className="text-sm text-content-muted">
                        Estoque indisponível. Você ainda pode manter as quantidades atuais.
                    </p>
                ) : null}
                <div className="space-y-2">
                    {itemOptions.map(({ id, fallbackName }) => {
                        const product = products.find((entry) => entry.id === id)
                        const quantity = quantityOf(id)
                        const currentOrderQuantity = order.items.find((item) => item.type === id)?.quantity ?? 0
                        const maxQuantity = (product?.disponible_stock ?? 0) + currentOrderQuantity

                        return (
                            <div key={id} className="flex items-center justify-between gap-3 rounded-lg bg-background-base px-3 py-2">
                                <span className="min-w-0 truncate text-sm font-medium text-content-primary">
                                    {product?.name ?? fallbackName}
                                </span>
                                <div className="flex shrink-0 items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        aria-label={`Remover ${fallbackName}`}
                                        leftIcon={<Minus />}
                                        disabled={quantity === 0}
                                        onClick={() => setQuantity(id, quantity - 1)}
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        max={maxQuantity}
                                        inputMode="numeric"
                                        aria-label={`Quantidade de ${fallbackName}`}
                                        value={quantity}
                                        onChange={(event) => setQuantity(id, Number(event.target.value))}
                                        className="h-8 w-14 rounded-md border border-input-border bg-input-bg text-center text-sm font-semibold tabular-nums text-input-content outline-none focus:border-input-focus-border focus:ring-2 focus:ring-input-focus-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        aria-label={`Adicionar ${fallbackName}`}
                                        leftIcon={<Plus />}
                                        disabled={quantity >= maxQuantity}
                                        onClick={() => setQuantity(id, quantity + 1)}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
                {errors.items?.message ? <p className="text-sm text-content-danger">{errors.items.message}</p> : null}
            </fieldset>

            <Textarea
                label="Observações"
                placeholder="Ex: entregar após as 14h"
                control={control}
                name="observations"
            />

            <div className="flex justify-end gap-2 border-t border-brd-subtle pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" loading={isSubmitting}>Salvar alterações</Button>
            </div>
        </form>
    )
}

function CustomerPicker({
    control,
    selectedCustomer,
    customerQuery,
    onQueryChange,
    onSelect,
}: {
    control: Control<UpdateOrderSchemaType>
    selectedCustomer: Customer | null
    customerQuery: string
    onQueryChange: (value: string) => void
    onSelect: (customer: Customer) => void
}) {
    const { field, fieldState } = useController({ control, name: "customer_id" })
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const search = selectedCustomer && customerQuery === selectedCustomer.name ? "" : customerQuery
    const { customers, isLoading, isError } = useSearchCustomers(search, isOpen)

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Escape") {
            setIsOpen(false)
            return
        }
        if (customers.length === 0) return

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setActiveIndex((index) => (index + 1) % customers.length)
        } else if (event.key === "ArrowUp") {
            event.preventDefault()
            setActiveIndex((index) => (index - 1 + customers.length) % customers.length)
        } else if (event.key === "Enter") {
            const customer = customers[activeIndex]
            if (customer) {
                event.preventDefault()
                onSelect(customer)
                field.onChange(customer.id)
                setIsOpen(false)
            }
        }
    }

    return (
        <div className="space-y-1">
            <div className="relative">
                <Input
                    label="Cliente"
                    error={fieldState.error?.message}
                    type="search"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-autocomplete="list"
                    autoComplete="off"
                    placeholder="Buscar por nome ou telefone"
                    leftIcon={<Search />}
                    value={customerQuery}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => {
                        field.onBlur()
                        setIsOpen(false)
                    }}
                    onKeyDown={handleKeyDown}
                    onChange={(event) => {
                        onQueryChange(event.target.value)
                        field.onChange("")
                        setActiveIndex(0)
                        setIsOpen(true)
                    }}
                />
                {isOpen ? (
                    <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-brd-default bg-background-elevated shadow-lg">
                        {isError ? (
                            <p className="px-3 py-2 text-sm text-content-danger">Não foi possível buscar os clientes.</p>
                        ) : customers.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-content-muted">
                                {isLoading ? "Buscando clientes..." : "Nenhum cliente encontrado."}
                            </p>
                        ) : (
                            <ul role="listbox" aria-label="Resultados de clientes">
                                {customers.map((customer, index) => (
                                    <li key={customer.id} role="option" aria-selected={customer.id === field.value}>
                                        <button
                                            type="button"
                                            className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-background-base ${index === activeIndex ? "bg-background-base" : ""}`}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onClick={() => {
                                                onSelect(customer)
                                                field.onChange(customer.id)
                                                setIsOpen(false)
                                            }}
                                        >
                                            <span className="truncate text-sm font-medium text-content-primary">{customer.name}</span>
                                            <span className="shrink-0 text-sm tabular-nums text-content-muted">{customer.phone}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : null}
            </div>
            {field.value && selectedCustomer ? (
                <p className="text-xs text-content-muted">Cliente selecionado: {selectedCustomer.name}</p>
            ) : null}
        </div>
    )
}

function orderFormValues(order: Order): UpdateOrderSchemaType {
    return {
        customer_id: order.customer_id,
        delivery_date: order.delivery_date.slice(0, 10),
        pickup_date: order.pickup_date.slice(0, 10),
        payment_method: order.payment_method,
        observations: order.observations ?? "",
        status: order.status,
        items: order.items.map((item) => ({ product_id: item.type, qtd: item.quantity })),
    }
}
