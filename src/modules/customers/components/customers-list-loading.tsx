const SKELETON_ROWS = 8

function Bone({ className }: { className: string }) {
    return <div className={`animate-pulse rounded-md bg-brd-subtle ${className}`} />
}

function CustomerRowSkeleton() {
    return (
        <div className="flex items-center gap-2 border-b border-brd-default p-4 first:border-t" aria-hidden>
            <Bone className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
                <Bone className="h-4 w-36" />
                <Bone className="h-3.5 w-28" />
            </div>
        </div>
    )
}

export function CustomersListLoading() {
    return (
        <div
            className="flex flex-col gap-4 rounded-lg border border-brd-default p-4"
            role="status"
            aria-busy="true"
            aria-label="Carregando clientes"
        >
            <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                    <Bone className="h-4 w-12" />
                    <Bone className="h-10 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                    <Bone className="h-4 w-16" />
                    <Bone className="h-10 w-full rounded-lg" />
                </div>
            </div>

            <div className="flex flex-col">
                {Array.from({ length: SKELETON_ROWS }, (_, index) => (
                    <CustomerRowSkeleton key={index} />
                ))}
            </div>

            <div className="flex items-center justify-between gap-3">
                <Bone className="h-4 w-24" />
                <div className="flex items-center gap-2">
                    <Bone className="h-9 w-24 rounded-lg" />
                    <Bone className="size-9 rounded-lg" />
                    <Bone className="h-9 w-24 rounded-lg" />
                </div>
            </div>
        </div>
    )
}
