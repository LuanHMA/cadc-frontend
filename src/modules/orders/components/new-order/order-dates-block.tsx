import { CalendarDays } from "lucide-react"
import { useWatch, type Control } from "react-hook-form"
import { Input } from "../../../../shared/components/ui"
import { todayDateOnly } from "../../../../shared/utils/formatations"
import type { CreateOrderSchemaType } from "../../contracts/orders-contracts"
import { OrderFormSection } from "./order-form-section"

export function OrderDatesBlock({ control }: { control: Control<CreateOrderSchemaType> }) {
    const deliveryDate = useWatch({ control, name: "delivery_date" })
    const today = todayDateOnly()

    return (
        <OrderFormSection icon={CalendarDays} title="Datas" description="Quando os itens serão entregues e recolhidos">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input type="date" label="Data de entrega" min={today} control={control} name="delivery_date" />
                <Input type="date" label="Data de recolhimento" min={deliveryDate || today} control={control} name="pickup_date" />
            </div>
        </OrderFormSection>
    )
}
