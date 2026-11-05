import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button.tsx"
import { cn } from "./cn.ts"

export type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const safeTotal = Math.max(totalPages, 1)
  const safePage = Math.min(Math.max(page, 1), safeTotal)
  const pages = visiblePages(safePage, safeTotal)

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > safeTotal || nextPage === safePage) return
    onPageChange(nextPage)
  }

  return (
    <nav aria-label="Paginação" className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <p className="text-sm text-content-muted">
        Página {safePage} de {safeTotal}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safePage <= 1}
          aria-label="Página anterior"
          leftIcon={<ChevronLeft />}
          onClick={() => changePage(safePage - 1)}
        >
          Anterior
        </Button>
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-content-muted" aria-hidden>
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={item === safePage ? "primary" : "outline"}
              aria-label={`Página ${item}`}
              aria-current={item === safePage ? "page" : undefined}
              onClick={() => changePage(item)}
            >
              {item}
            </Button>
          ),
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safePage >= safeTotal}
          aria-label="Próxima página"
          rightIcon={<ChevronRight />}
          onClick={() => changePage(safePage + 1)}
        >
          Próximo
        </Button>
      </div>
    </nav>
  )
}

function visiblePages(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const pages: Array<number | "ellipsis"> = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push("ellipsis")
  for (let page = start; page <= end; page += 1) pages.push(page)
  if (end < total - 1) pages.push("ellipsis")
  pages.push(total)

  return pages
}
