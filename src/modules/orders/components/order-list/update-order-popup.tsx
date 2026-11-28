import { Pencil } from "lucide-react"
import { Dialog } from "radix-ui"
import { useState } from "react"
import { Button } from "../../../../shared/components/ui"
import type { Order } from "../../contracts/orders-contracts"
import { UpdateOrderForm } from "./update-order-form"

export function UpdateOrderPopup({ order, onUpdated }: { order: Order; onUpdated: () => void }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <Button type="button" variant="outline" size="sm" leftIcon={<Pencil />}>
                    Editar pedido
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[60] bg-background-inverse/50 data-[state=open]:animate-fadeIn" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] max-h-[90vh] w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-background-elevated p-5   focus:outline-none data-[state=open]:animate-fadeIn">
                    <Dialog.Title className="border-b border-brd-subtle pb-4 text-lg font-semibold text-content-primary">
                        Editar pedido #{order.id.split("-")[0].toUpperCase()}
                    </Dialog.Title>
                    {isOpen ? (
                        <UpdateOrderForm
                            order={order}
                            onClose={() => setIsOpen(false)}
                            onUpdated={onUpdated}
                        />
                    ) : null}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
