import { useQuery } from "@tanstack/react-query";
import { MapPinIcon, PhoneIcon, SearchX } from "lucide-react";
import { Button } from "../../../shared/components/ui";
import { currency, formatDate, formatPhone } from "../../../shared/utils/formatations";
import type { Customer } from "../contracts/customers-contracts";
import { customersService } from "../services/customers.service";
import { CustomerDetailsLoading } from "./customer-details-loading";
import { DeleteCustomerPopup } from "./delete-customer-popup";
import { UpdateCustomerPopup } from "./update-customer-popup";

export function CustomerDetailsEmpty({ filtered = false }: { filtered?: boolean }) {
    return (
        <div className="col-span-1 space-y-4 rounded-lg border border-brd-default p-4">
            <div className="flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-background-accent/10 text-content-muted">
                    <SearchX className="size-5" />
                </span>
                <div className="flex flex-col items-start">
                    <p className="text-lg font-medium text-content-primary">
                        {filtered ? "Cliente não encontrado" : "Nenhum cliente selecionado"}
                    </p>
                    <p className="text-sm text-content-muted">
                        {filtered ? "Nenhum cliente corresponde aos filtros." : "Cadastre um cliente para ver os detalhes."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col items-start rounded-lg border border-brd-default p-4">
                    <h2 className="text-sm font-medium text-content-muted">Telefone</h2>
                    <p className="text-lg font-medium text-content-muted">—</p>
                </div>
                <div className="flex flex-col items-start rounded-lg border border-brd-default p-4">
                    <h2 className="text-sm font-medium text-content-muted">Endereço</h2>
                    <p className="text-lg font-medium text-content-muted">—</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col items-start rounded-lg border border-brd-default p-4">
                    <h2 className="text-sm font-medium text-content-muted">Pedidos em andamento</h2>
                    <p className="text-lg font-medium text-content-muted">—</p>
                </div>
                <div className="flex flex-col items-start rounded-lg border border-brd-default p-4">
                    <h2 className="text-sm font-medium text-content-muted">Pedidos concluídos</h2>
                    <p className="text-lg font-medium text-content-muted">—</p>
                </div>
                <div className="flex flex-col items-start rounded-lg border border-brd-default p-4">
                    <h2 className="text-sm font-medium text-content-muted">Total gasto</h2>
                    <p className="text-lg font-medium text-content-muted">—</p>
                </div>
            </div>
        </div>
    )
}

export function CustomerDetails({ customerId }: { customerId: Customer["id"] }) {
    const { data, isLoading } = useQuery({
        queryKey: ["customer", customerId],
        queryFn: () => customersService.get(customerId),
    })

    if (isLoading) return <CustomerDetailsLoading />

    if (!data) return <CustomerDetailsEmpty filtered />

    const customer = data.customer

    const handleContact = () => {
        window.open(`https://wa.me/${customer.phone}`, "_blank")
    }

    const handleLocate = () => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${customer.street}, ${customer.house_number}, ${customer.district}, Mesquita, RJ, ${customer.complement ? customer.complement : ""}`, "_blank")
    }

    return (
        <div className="border border-brd-default rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="uppercase font-medium rounded-full w-12 h-12 flex items-center justify-center bg-background-accent/20 text-base">
                        {customer.name.charAt(0)}{customer.name.charAt(1)}
                    </span>

                    <div className="flex flex-col items-start">
                        <p className="text-lg text-content-primary font-medium">{customer.name}</p>
                        <p className="text-sm text-content-muted">Cadastrado em {formatDate(customer.created_at)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="w-full" leftIcon={<PhoneIcon className="size-4" />} onClick={handleContact}>
                    Contatar
                </Button>
                <Button variant="outline" className="w-full" leftIcon={<MapPinIcon className="size-4" />} onClick={handleLocate}>
                    Localizar
                </Button>
                <UpdateCustomerPopup customer={customer} />
                <DeleteCustomerPopup customer={customer} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-start border border-brd-default p-4 rounded-lg">
                    <h2 className="text-sm text-content-muted font-medium">Telefone</h2>
                    <p className="text-sm text-content-primary font-medium">{formatPhone(customer.phone)}</p>
                </div>

                <div className="flex flex-col items-start border border-brd-default p-4 rounded-lg">
                    <h2 className="text-sm text-content-muted font-medium">Endereço</h2>
                    <p className="text-sm text-content-primary font-medium">{customer.street}, {customer.house_number} {customer.district}</p>
                    <p className="text-sm text-content-muted">{customer.complement ? `- ${customer.complement}` : ""}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col items-start border border-brd-default p-4 rounded-lg">
                    <h2 className="text-sm text-content-muted font-medium">Pedidos em andamento</h2>
                    <p className="text-lg text-content-primary font-medium">{customer.active_orders}</p>
                </div>
                <div className="flex flex-col items-start border border-brd-default p-4 rounded-lg">
                    <h2 className="text-sm text-content-muted font-medium">Pedidos concluídos</h2>
                    <p className="text-lg text-content-primary font-medium">{customer.completed_orders}</p>
                </div>
            </div>
            <div className="flex flex-col items-start border border-brd-default p-4 rounded-lg">
                <h2 className="text-sm text-content-muted font-medium">Total gasto</h2>
                <p className="text-lg text-content-primary font-medium">{currency.format(customer.total_spent)}</p>
            </div>
        </div>
    )
}

