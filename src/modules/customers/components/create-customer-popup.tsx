import { Plus, UserPlus } from "lucide-react"
import { Dialog } from "radix-ui"
import { useState } from "react"
import { Button } from "../../../shared/components/ui"
import { CreateCustomerForm } from "./create-customer-form"

export function CreateCustomerPopup() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <Button leftIcon={<Plus />}>
                    Novo cliente
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-background-inverse/50 data-[state=open]:animate-fadeIn" />
                <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-background-elevated p-5 shadow-lg focus:outline-none data-[state=open]:animate-fadeIn">
                    <Dialog.Title className="m-0 flex items-center gap-2.5 border-b border-brd-subtle pb-4 text-[17px] font-medium text-content-primary">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-badge-accent-bg text-badge-accent-content">
                            <UserPlus className="size-4" />
                        </span>
                        Novo cliente
                    </Dialog.Title>

                    <CreateCustomerForm onClose={() => setIsOpen(false)} />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
