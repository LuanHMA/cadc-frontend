import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { Dialog } from "radix-ui"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "../../../../shared/components/ui"
import { getApiErrorMessage } from "../../../../shared/lib/api"
import { stockQueryKey } from "../../../stock/hooks/use-get-stock"
import type { Order } from "../../contracts/orders-contracts"
import { ordersQueryKey } from "../../hooks/use-get-orders"
import { orderService } from "../../services/order.service"

export function DeleteOrderPopup({ order, onDeleted }: { order: Order; onDeleted: () => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => orderService.delete(order.id),
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
            queryClient.invalidateQueries({ queryKey: stockQueryKey }),
        ]),
    })

    async function onDelete() {
        try {
            await mutateAsync()
            toast.success("Pedido excluído com sucesso")
            setIsOpen(false)
            onDeleted()
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Não foi possível excluir o pedido."))
        }
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <Button type="button" variant="danger" size="sm" leftIcon={<Trash2 />}>
                    Excluir pedido
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[60] bg-background-inverse/50 data-[state=open]:animate-fadeIn" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-background-elevated p-5 shadow-lg focus:outline-none data-[state=open]:animate-fadeIn">
                    <Dialog.Title className="border-b border-brd-subtle pb-4 text-lg font-semibold text-content-primary">
                        Excluir pedido
                    </Dialog.Title>
                    <p className="mt-4 text-sm text-content-primary">
                        Tem certeza que deseja excluir o pedido <b>#{order.id.split("-")[0].toUpperCase()}</b>? Esta ação não pode ser desfeita.
                    </p>
                    <div className="mt-5 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="danger" loading={isPending} onClick={onDelete}>
                            Excluir pedido
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
