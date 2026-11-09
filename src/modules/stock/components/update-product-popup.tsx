import { PencilIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { Button } from "../../../shared/components/ui";
import type { Product } from "../contracts/stock.contracts";
import { UpdateProductForm } from "./update-product-form";

export function UpdateProductPopup({ product }: { product: Product }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild >
                <Button variant="outline" size="sm" leftIcon={<PencilIcon className="size-5" />}>
                    Ajustar
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-background-inverse/50 data-[state=open]:animate-fadeIn" />
                <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background-elevated p-5 shadow-lg focus:outline-none data-[state=open]:animate-fadeIn">
                    <Dialog.Title className="m-0 flex items-center gap-2.5 border-b border-brd-subtle pb-4 text-[17px] font-medium text-content-primary">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-badge-accent-bg text-badge-accent-content">
                            <PencilIcon className="size-4" />
                        </span>
                        <span className="min-w-0">Editando: {product.name}</span>
                    </Dialog.Title>

                    <UpdateProductForm product={product} onClose={() => setIsOpen(false)} />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
