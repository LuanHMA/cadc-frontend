import { Armchair, Boxes, Table2, type LucideIcon } from "lucide-react"
import type { Product } from "../contracts/stock.contracts"

export const productTypes: Record<Product["id"], { icon: LucideIcon; tone: string }> = {
    TABLE: { icon: Table2, tone: "bg-badge-info-bg text-badge-info-content" },
    CHAIR: { icon: Armchair, tone: "bg-badge-accent-bg text-badge-accent-content" },
    KIT: { icon: Boxes, tone: "bg-badge-success-bg text-badge-success-content" },
}
