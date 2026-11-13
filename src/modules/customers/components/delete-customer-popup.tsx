import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PencilIcon, TrashIcon } from "lucide-react"
import { Dialog } from "radix-ui"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "../../../shared/components/ui"
import { getApiErrorMessage } from "../../../shared/lib/api"
import type { Customer } from "../contracts/customers-contracts"
import { customersQueryKey } from "../hooks/use-get-customer"
import { customersService } from "../services/customers.service"

export function DeleteCustomerPopup({ customer }: { customer: Customer }) {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => customersService.delete(customer.id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: customersQueryKey }),
    })

    const onDelete = async () => {
        try {
            await mutateAsync()
            toast.success("Cliente excluído com sucesso")
            setIsOpen(false)
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Não foi possível excluir o cliente."))
        }
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <Button variant="danger" className="w-full" leftIcon={<PencilIcon className="size-4" />}>
                    Excluir
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-background-inverse/50 data-[state=open]:animate-fadeIn" />
                <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-background-elevated p-5 shadow-lg focus:outline-none data-[state=open]:animate-fadeIn">
                    <Dialog.Title className="m-0 flex items-center gap-2.5 border-b border-brd-subtle pb-4 text-[17px] font-medium text-content-primary">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-badge-accent-bg text-badge-accent-content">
                            <TrashIcon className="size-4" />
                        </span>
                        <span className="min-w-0">Excluir cliente</span>
                    </Dialog.Title>

                    <p className="mt-2 text-sm text-content-primary">Tem certeza que deseja excluir <b className="text-content-danger">{customer.name}</b> da lista de clientes? essa ação é irreversivel?</p>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                        <Button type="button" variant="danger" onClick={onDelete} loading={isPending}>Excluir</Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
