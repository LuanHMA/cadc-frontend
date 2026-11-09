import { CreateCustomerPopup } from "../../modules/customers/components/create-customer-popup"
import { CustomerDetails, CustomerDetailsEmpty } from "../../modules/customers/components/customer-details"
import { CustomerDetailsLoading } from "../../modules/customers/components/customer-details-loading"
import { CustomerListFilters } from "../../modules/customers/components/customer-list-filters"
import { CustomersList } from "../../modules/customers/components/customers-list"
import { CustomersListLoading } from "../../modules/customers/components/customers-list-loading"
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
        handleSelectCustomer,
        selectedCustomer,
        hasActiveFilters,
    } = useGetCustomer()



    return (
        <main className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold text-content-primary">Clientes</h1>
                <CreateCustomerPopup />
            </div>
            {isError ? <p className="text-sm text-content-danger">Erro ao buscar clientes</p> : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-4">
                    {isLoading ? <CustomersListLoading /> : (
                        <div className="flex flex-col gap-4 border border-brd-default rounded-lg p-4">
                            <CustomerListFilters
                                page={page}
                                name={name}
                                phone={phone}
                                onNameChange={setName}
                                onPhoneChange={setPhone}
                            />

                            <CustomersList
                                customers={customers}
                                pagination={pagination}
                                page={page}
                                onPageChange={setPage}
                                isLoading={isLoading}
                                onSelectCustomer={handleSelectCustomer}
                                selectedCustomer={selectedCustomer}
                                isFiltered={hasActiveFilters}
                            />
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <CustomerDetailsLoading />
                ) : selectedCustomer ? (
                    <CustomerDetails
                        customerId={selectedCustomer}
                    />
                ) : (
                    <CustomerDetailsEmpty filtered={hasActiveFilters} />
                )}
            </div>

        </main>
    )
}
