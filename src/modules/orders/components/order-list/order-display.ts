import { formatDateOnly } from "../../../../shared/utils/formatations"
import type { ItemType, Order } from "../../contracts/orders-contracts"

const itemLabels: Record<ItemType, { singular: string; plural: string }> = {
    TABLE: { singular: "mesa", plural: "mesas" },
    CHAIR: { singular: "cadeira", plural: "cadeiras" },
    KIT: { singular: "kit", plural: "kits" },
}

export function formatOrderDate(date: string) {
    return formatDateOnly(date.slice(0, 10))
}

export function formatOrderItems(items: Order["items"]) {
    if (items.length === 0) return "—"

    return items
        .map(({ type, quantity }) => {
            const label = itemLabels[type]
            return `${quantity} ${quantity === 1 ? label.singular : label.plural}`
        })
        .join(" · ")
}

export function formatOrderDateTime(date: string) {
    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) return date

    return parsedDate.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}
