import { useId, useState, type ReactNode, type Ref } from "react"
import { type Control, type FieldPath, type FieldValues, useController } from "react-hook-form"
import { Select as SelectPrimitive } from "radix-ui"
import { cn } from "./cn.ts"
import { Field } from "./field.tsx"
import {
  type ControlSize,
  type FieldVariant,
  controlPaddingClass,
  controlSizeClass,
  fieldDescribedBy,
  fieldIconClass,
  fieldVariantClass,
  iconSvgClass,
} from "./styles.ts"

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
  icon?: ReactNode
}

type SelectControlProps = {
  ref?: Ref<HTMLButtonElement>
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  required?: boolean
  size?: ControlSize
  variant?: FieldVariant
  leftIcon?: ReactNode
  options: SelectOption[]
  placeholder?: string
  label?: ReactNode
  hint?: ReactNode
  error?: string
  className?: string
  wrapperClassName?: string
}

export type SelectProps<T extends FieldValues = FieldValues> = SelectControlProps &
  (
    | {
        control: Control<T>
        name: FieldPath<T>
      }
    | {
        control?: undefined
      }
  )

export function Select<T extends FieldValues>(props: SelectProps<T>) {
  if (props.control) {
    return <ControlledSelect {...props} control={props.control} name={props.name} />
  }

  return <SelectControl {...props} />
}

function ControlledSelect<T extends FieldValues>({
  control,
  name,
  error,
  onChange,
  onBlur,
  ref,
  defaultValue,
  ...props
}: SelectControlProps & {
  control: Control<T>
  name: FieldPath<T>
}) {
  const { field, fieldState } = useController({
    control,
    name,
    ...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {}),
  })

  return (
    <SelectControl
      {...props}
      ref={(node) => {
        field.ref(node)
        assignRef(ref, node)
      }}
      name={field.name}
      value={field.value == null ? "" : String(field.value)}
      onChange={(next) => {
        field.onChange(next)
        onChange?.(next)
      }}
      onBlur={() => {
        field.onBlur()
        onBlur?.()
      }}
      error={error ?? fieldState.error?.message}
    />
  )
}

function SelectControl({
  ref,
  id,
  name,
  value,
  defaultValue,
  onChange,
  onBlur,
  disabled,
  required,
  size = "md",
  variant = "default",
  leftIcon,
  options,
  placeholder = "Selecione",
  label,
  hint,
  error,
  className,
  wrapperClassName,
}: SelectControlProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const invalid = Boolean(error)
  const resolvedVariant = invalid ? "error" : variant
  const [internalValue, setInternalValue] = useState(defaultValue ?? "")
  const currentValue = value !== undefined ? value : internalValue
  const selected = options.find((option) => option.value === currentValue)
  const triggerIcon = leftIcon ?? selected?.icon

  return (
    <Field id={selectId} label={label} hint={hint} error={error} className={wrapperClassName}>
      <SelectPrimitive.Root
        name={name}
        value={currentValue}
        required={required}
        disabled={disabled}
        onValueChange={(next) => {
          if (value === undefined) setInternalValue(next)
          onChange?.(next)
        }}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          id={selectId}
          onBlur={onBlur}
          aria-invalid={invalid || undefined}
          aria-describedby={fieldDescribedBy(selectId, error, hint)}
          data-size={size}
          data-variant={resolvedVariant}
          className={cn(
            "flex w-full items-center justify-between gap-2 border text-left transition-[color,background-color,border-color,box-shadow] duration-150 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:border-input-disabled-border disabled:bg-input-disabled-bg disabled:text-input-disabled-content disabled:hover:border-input-disabled-border data-placeholder:text-input-placeholder",
            controlSizeClass[size],
            controlPaddingClass[size],
            fieldVariantClass[resolvedVariant],
            className,
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {triggerIcon ? (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center justify-center",
                  iconSvgClass[size],
                  disabled ? "text-input-disabled-content" : fieldIconClass[resolvedVariant],
                )}
              >
                {triggerIcon}
              </span>
            ) : null}
            <SelectPrimitive.Value placeholder={placeholder} className="truncate" />
          </span>
          <SelectPrimitive.Icon
            className={cn("shrink-0", disabled ? "text-input-disabled-content" : "text-content-muted")}
          >
            <Chevron className={size === "lg" ? "size-5" : "size-4"} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={6}
            className="z-50 max-h-60 w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-brd-default bg-background-surface shadow-md"
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-content-primary outline-none data-[disabled]:pointer-events-none data-[disabled]:text-input-disabled-content data-[highlighted]:bg-background-base data-[state=checked]:text-content-accent"
                >
                  {option.icon ? (
                    <span className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                      {option.icon}
                    </span>
                  ) : null}
                  <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="ml-auto text-content-accent">
                    <Check className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </Field>
  )
}

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") {
    ref(node)
    return
  }

  if (ref) {
    ;(ref as { current: T | null }).current = node
  }
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12.5l4.2 4.2L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
