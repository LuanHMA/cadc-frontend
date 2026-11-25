import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type OrderFormSectionProps = {
    icon: LucideIcon
    title: string
    description?: string
    action?: ReactNode
    children: ReactNode
}

export function OrderFormSection({ icon: Icon, title, description, action, children }: OrderFormSectionProps) {
    return (
        <section className="space-y-4 rounded-2xl border border-brd-default bg-background-elevated p-5">
            <header className="flex items-center justify-between gap-4 border-b border-brd-subtle pb-4">
                <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-badge-accent-bg text-badge-accent-content">
                        <Icon className="size-4" />
                    </span>
                    <div>
                        <h2 className="text-base font-semibold text-content-primary">{title}</h2>
                        {description ? <p className="text-sm text-content-muted">{description}</p> : null}
                    </div>
                </div>
                {action}
            </header>
            {children}
        </section>
    )
}
