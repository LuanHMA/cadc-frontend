const SKELETON_CARDS = 8

function Bone({ className }: { className: string }) {
    return <div className={`animate-pulse rounded-md bg-brd-subtle ${className}`} />
}

function CustomerCardSkeleton() {
    return (
        <article
            className="flex h-full flex-col gap-5 rounded-2xl border border-brd-default bg-background-elevated p-5"
            aria-hidden
        >
            <div className="flex items-center gap-3">
                <Bone className="size-12 shrink-0 rounded-xl" />
                <Bone className="h-5 w-36" />
            </div>

            <div className="space-y-3 border-t border-brd-subtle pt-4">
                <div className="flex items-center justify-between gap-3">
                    <Bone className="h-4 w-16" />
                    <Bone className="h-4 w-28" />
                </div>
                <div className="flex items-center justify-between gap-3">
                    <Bone className="h-4 w-20" />
                    <Bone className="h-4 w-32" />
                </div>
                <div className="flex items-center justify-between gap-3">
                    <Bone className="h-4 w-14" />
                    <Bone className="h-4 w-24" />
                </div>
                <div className="flex items-center justify-between gap-3">
                    <Bone className="h-4 w-20" />
                    <Bone className="h-4 w-28" />
                </div>
            </div>

            <div className="mt-auto flex gap-2">
                <Bone className="h-10 flex-1 rounded-lg" />
                <Bone className="h-10 flex-1 rounded-lg" />
            </div>
        </article>
    )
}

export function CustomersListLoading() {
    return (
        <div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
            role="status"
            aria-busy="true"
            aria-label="Carregando clientes"
        >
            {Array.from({ length: SKELETON_CARDS }, (_, index) => (
                <CustomerCardSkeleton key={index} />
            ))}
        </div>
    )
}
