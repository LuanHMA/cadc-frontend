import { type ButtonHTMLAttributes, type ReactNode } from "react"
import { cn } from "./cn.ts"
import { type ControlSize, iconSvgClass } from "./styles.ts"

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline"
  | "link"
  | "success"
  | "highlight"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ControlSize
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const sizeClass: Record<ControlSize, string> = {
  icon: "p-2 rounded-md ",
  sm: "h-8 rounded-md text-sm",
  md: "h-10 rounded-lg text-sm",
  lg: "h-12 rounded-lg text-base",
}

const paddingClass: Record<ControlSize, string> = {
  icon: "p-2",
  sm: "px-3",
  md: "px-4",
  lg: "px-5",
}

const iconOnlySizeClass: Record<ControlSize, string> = {
  icon: "p-2",
  sm: "w-8 px-0",
  md: "w-10 px-0",
  lg: "w-12 px-0",
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-btn-primary-bg text-btn-primary-content hover:bg-btn-primary-hover-bg active:bg-btn-primary-active-bg",
  secondary:
    "border-transparent bg-btn-secondary-bg text-btn-secondary-content hover:bg-btn-secondary-hover-bg active:bg-btn-secondary-active-bg",
  danger:
    "border-transparent bg-btn-danger-bg text-btn-danger-content hover:bg-btn-danger-hover-bg active:bg-btn-danger-active-bg",
  outline:
    "border-btn-outline-border bg-btn-outline-bg text-btn-outline-content hover:bg-btn-outline-hover-bg hover:text-btn-outline-hover-content active:bg-btn-outline-active-bg",
  link: "border-transparent bg-btn-link-bg text-btn-link-content hover:text-btn-link-hover-content",
  success:
    "border-transparent bg-btn-success-bg text-btn-success-content hover:bg-btn-success-hover-bg active:bg-btn-success-active-bg",
  highlight:
    "border-transparent bg-linear-to-b from-btn-highlight-bg to-btn-highlight-to text-btn-highlight-content hover:from-btn-highlight-hover-bg hover:to-btn-highlight-hover-bg active:from-btn-highlight-hover-bg active:to-btn-highlight-hover-bg",
}

const disabledClass: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-btn-primary-disabled-bg text-btn-primary-disabled-content",
  secondary: "border-transparent bg-btn-secondary-disabled-bg text-btn-secondary-disabled-content",
  danger: "border-transparent bg-btn-danger-disabled-bg text-btn-danger-disabled-content",
  outline: "border-btn-outline-disabled-border bg-transparent text-btn-outline-disabled-content",
  link: "border-transparent bg-transparent text-btn-link-disabled-content",
  success: "border-transparent bg-btn-success-disabled-bg text-btn-success-disabled-content",
  highlight:
    "border-transparent bg-none bg-btn-highlight-disabled-bg text-content-muted",
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  type,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled)
  const iconOnly = !children && Boolean(leftIcon || rightIcon)

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled || loading}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center border font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-input-focus-ring focus-visible:outline-none disabled:opacity-100",
        sizeClass[size],
        iconOnly ? iconOnlySizeClass[size] : paddingClass[size],
        isDisabled && !loading ? disabledClass[variant] : variantClass[variant],
        loading ? "cursor-wait" : isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center",
          iconSvgClass[size],
          size === "sm" ? "gap-1.5" : "gap-2",
          loading && "opacity-0",
        )}
      >
        {leftIcon ? <IconSlot>{leftIcon}</IconSlot> : null}
        {children}
        {rightIcon ? <IconSlot>{rightIcon}</IconSlot> : null}
      </span>
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className={size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4"} />
        </span>
      ) : null}
    </button>
  )
}

function IconSlot({ children }: { children: ReactNode }) {
  return <span className="inline-flex shrink-0 items-center justify-center">{children}</span>
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-90"
      />
    </svg>
  )
}

export type { ButtonProps }
