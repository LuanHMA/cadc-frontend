import type { ReactNode } from "react"
import { cn } from "./cn.ts"

type FieldProps = {
  id: string
  label?: ReactNode
  hint?: ReactNode
  error?: string
  className?: string
  children: ReactNode
}

export function Field({ id, label, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-content-primary">
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-content-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-content-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
