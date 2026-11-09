function Bone({ className }: { className: string }) {
    return <div className={`animate-pulse rounded-md bg-brd-subtle ${className}`} />
}

export function CustomerDetailsLoading() {
    return (
        <div
            className="col-span-2 space-y-4 rounded-lg border border-brd-default p-4"
            role="status"
            aria-busy="true"
            aria-label="Carregando detalhes do cliente"
        >
            <div className="flex items-center gap-3">
                <Bone className="size-12 shrink-0 rounded-full" />
                <div className="flex flex-col gap-2">
                    <Bone className="h-5 w-44" />
                    <Bone className="h-3.5 w-36" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 rounded-lg border border-brd-default p-4">
                    <Bone className="h-4 w-16" />
                    <Bone className="h-6 w-36" />
                </div>
                <div className="space-y-2 rounded-lg border border-brd-default p-4">
                    <Bone className="h-4 w-20" />
                    <Bone className="h-6 w-full" />
                    <Bone className="h-3.5 w-32" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2 rounded-lg border border-brd-default p-4">
                    <Bone className="h-4 w-32" />
                    <Bone className="h-6 w-10" />
                </div>
                <div className="space-y-2 rounded-lg border border-brd-default p-4">
                    <Bone className="h-4 w-28" />
                    <Bone className="h-6 w-10" />
                </div>
                <div className="space-y-2 rounded-lg border border-brd-default p-4">
                    <Bone className="h-4 w-20" />
                    <Bone className="h-6 w-24" />
                </div>
            </div>
        </div>
    )
}
