import { Banknote, CreditCard, Ellipsis, QrCode, Wallet, WalletCards, type LucideIcon } from "lucide-react"
import { useController, type Control } from "react-hook-form"
import { Textarea } from "../../../../shared/components/ui"
import { paymentMethodLabels, type CreateOrderSchemaType, type PaymentMethod } from "../../contracts/orders-contracts"
import { OrderFormSection } from "./order-form-section"

const paymentMethods: { value: PaymentMethod; icon: LucideIcon }[] = [
    { value: "PIX", icon: QrCode },
    { value: "CASH", icon: Banknote },
    { value: "CREDIT_CARD", icon: CreditCard },
    { value: "DEBIT_CARD", icon: WalletCards },
    { value: "OTHER", icon: Ellipsis },
]

export function OrderPaymentBlock({ control }: { control: Control<CreateOrderSchemaType> }) {
    const { field, fieldState } = useController({ control, name: "payment_method" })

    return (
        <OrderFormSection icon={Wallet} title="Pagamento" description="Forma de pagamento e observações">
            <fieldset className="space-y-1.5">
                <legend className="mb-1.5 text-sm font-medium text-content-primary">Forma de pagamento</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {paymentMethods.map(({ value, icon: Icon }) => {
                        const checked = field.value === value

                        return (
                            <label
                                key={value}
                                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-3 text-sm font-medium transition-colors has-focus-visible:ring-2 has-focus-visible:ring-input-focus-ring ${checked ? "border-brd-accent bg-badge-accent-bg text-badge-accent-content" : "border-brd-default text-content-primary hover:border-brd-strong"}`}
                            >
                                <input
                                    ref={value === "PIX" ? (node) => field.ref(node) : undefined}
                                    type="radio"
                                    name={field.name}
                                    value={value}
                                    checked={checked}
                                    onChange={() => field.onChange(value)}
                                    onBlur={field.onBlur}
                                    className="sr-only"
                                />
                                <Icon className="size-5" />
                                {paymentMethodLabels[value]}
                            </label>
                        )
                    })}
                </div>
                {fieldState.error ? <p className="text-sm text-content-danger">{fieldState.error.message}</p> : null}
            </fieldset>

            <Textarea label="Observações" placeholder="Ex: entregar após as 14h" control={control} name="observations" />
        </OrderFormSection>
    )
}
