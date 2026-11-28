import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { Dialog } from "radix-ui"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "../../../../shared/components/ui"
import { getApiErrorMessage } from "../../../../shared/lib/api"
import { stockQueryKey } from "../../../stock/hooks/use-get-stock"
import type { Order } from "../../contracts/orders-contracts"
import { ordersQueryKey } from "../../hooks/use-get-orders"
import { orderService } from "../../services/order.service"

export function CancelOrderPopup({ order, onCanceled }: { order: Order; onCanceled: () => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => orderService.cancelOrder(order.id),
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
            queryClient.invalidateQueries({ queryKey: stockQueryKey }),
        ]),
    })

    async function onCancel() {
        try {
            await mutateAsync()
            toast.success("Pedido cancelado com sucesso")
            setIsOpen(false)
            onCanceled()
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Não foi possível cancelar o pedido."))
        }
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <Button type="button" variant="danger" size="sm" leftIcon={<X />}>
                    Cancelar pedido
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[60] bg-background-inverse/50 data-[state=open]:animate-fadeIn" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-background-elevated p-5   focus:outline-none data-[state=open]:animate-fadeIn">
                    <Dialog.Title className="border-b border-brd-subtle pb-4 text-lg font-semibold text-content-primary">
                        Cancelar pedido
                    </Dialog.Title>
                    <p className="mt-4 text-sm text-content-primary">
                        Tem certeza que deseja cancelar o pedido <b>#{order.id.split("-")[0].toUpperCase()}</b>? O estoque desse pedido voltará a ser contabilizado e o pedido será removido da lista de pedidos ativos.
                    </p>
                    <div className="mt-5 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="danger" loading={isPending} onClick={onCancel}>
                            Cancelar pedido
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
