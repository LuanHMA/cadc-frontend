const SKELETON_CARDS = 3

function Bone({ className }: { className: string }) {
    return <div className={`animate-pulse rounded-md bg-brd-subtle ${className}`} />
}

function ProductCardSkeleton() {
    return (
        <article
            className="flex flex-col rounded-2xl border border-brd-default bg-background-elevated p-5 space-y-5"
            aria-hidden
        >
            <div className="flex items-center gap-3">
                <Bone className="size-12 shrink-0 rounded-xl" />
                <Bone className="h-5 w-32" />
            </div>

            <Bone className="h-9 w-28" />

            <div className="space-y-3 border-t border-brd-subtle pt-4">
                <div className="flex items-center justify-between gap-3">
                    <Bone className="h-4 w-24" />
                    <Bone className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between gap-3">
                    <Bone className="h-4 w-32" />
                    <Bone className="h-4 w-20" />
                </div>
            </div>

            <Bone className="h-10 w-full rounded-lg" />
        </article>
    )
}

export function ProductListLoading() {
    return (
        <div
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            role="status"
            aria-busy="true"
            aria-label="Carregando produtos"
        >
            {Array.from({ length: SKELETON_CARDS }, (_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    )
}
