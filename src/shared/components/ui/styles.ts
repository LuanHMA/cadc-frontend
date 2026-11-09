export const controlSizes = ["sm", "md", "lg", "icon"] as const
export type ControlSize = (typeof controlSizes)[number]

export const fieldVariants = ["default", "error", "success"] as const
export type FieldVariant = (typeof fieldVariants)[number]

export const controlSizeClass: Record<ControlSize, string> = {
  sm: "h-8 rounded-md text-sm",
  md: "h-10 rounded-lg text-sm",
  lg: "h-12 rounded-lg text-base",
  icon: "rounded-lg text-sm",
}

export const controlPaddingClass: Record<ControlSize, string> = {
  icon: "p-3",
  sm: "px-2.5",
  md: "px-3",
  lg: "px-3.5",
}

export const iconSlotClass: Record<ControlSize, string> = {
  sm: "w-8 [&_svg]:size-3.5",
  md: "w-9 [&_svg]:size-4",
  lg: "w-10 [&_svg]:size-5",
  icon: "w-8 [&_svg]:size-3.5",
}

export const iconSvgClass: Record<ControlSize, string> = {
  sm: "[&_svg]:size-3.5",
  md: "[&_svg]:size-4",
  lg: "[&_svg]:size-5",
  icon: "[&_svg]:size-3.5",
}

export const fieldVariantClass: Record<FieldVariant, string> = {
  default:
    "border-input-border bg-input-bg text-input-content hover:border-brd-strong focus:border-input-focus-border focus:bg-input-focus-bg focus:ring-input-focus-ring aria-[invalid=true]:border-input-error-border aria-[invalid=true]:focus:border-input-error-border aria-[invalid=true]:focus:ring-input-error-border/25",
  error:
    "border-input-error-border bg-input-bg text-input-content focus:border-input-error-border focus:bg-input-focus-bg focus:ring-input-error-border/25",
  success:
    "border-input-success-border bg-input-bg text-input-content focus:border-input-success-border focus:bg-input-focus-bg focus:ring-input-success-border/25",
}

export const fieldIconClass: Record<FieldVariant, string> = {
  default: "text-content-muted",
  error: "text-content-danger",
  success: "text-content-success",
}

export function fieldDescribedBy(id: string, error?: string, hint?: unknown) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}
