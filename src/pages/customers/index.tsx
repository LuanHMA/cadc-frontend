import { CreateCustomerPopup } from "../../modules/customers/components/create-customer-popup"
import { CustomersList } from "../../modules/customers/components/customers-list"
import { useGetCustomer } from "../../modules/customers/hooks/use-get-customer"

export function CustomersPage() {
    const {
        customers,
        pagination,
        page,
        isLoading,
        isError,
        name,
        phone,
        setName,
        setPhone,
        setPage,
    } = useGetCustomer()

    return (
        <main className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold text-content-primary">Clientes</h1>
                <CreateCustomerPopup />
            </div>
            {isError ? <p className="text-sm text-content-danger">Erro ao buscar clientes</p> : null}
            <CustomersList
                customers={customers}
                pagination={pagination}
                page={page}
                name={name}
                phone={phone}
                onNameChange={setName}
                onPhoneChange={setPhone}
                onPageChange={setPage}
                isLoading={isLoading}
            />
        </main>
    )
}
