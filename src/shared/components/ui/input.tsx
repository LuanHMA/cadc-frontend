import { useId, useState, type ComponentProps, type ReactNode, type Ref } from "react"
import { type Control, type FieldPath, type FieldValues, useController } from "react-hook-form"
import { cn } from "./cn.ts"
import { Field } from "./field.tsx"
import {
  type ControlSize,
  type FieldVariant,
  controlSizeClass,
  fieldDescribedBy,
  fieldIconClass,
  fieldVariantClass,
  iconSlotClass,
} from "./styles.ts"

type InputControlProps = Omit<ComponentProps<"input">, "size"> & {
  ref?: Ref<HTMLInputElement>
  size?: ControlSize
  variant?: FieldVariant
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  label?: ReactNode
  hint?: ReactNode
  error?: string
  wrapperClassName?: string
}

export type InputProps<T extends FieldValues = FieldValues> = InputControlProps &
  (
    | {
        control: Control<T>
        name: FieldPath<T>
      }
    | {
        control?: undefined
      }
  )

export function Input<T extends FieldValues>(props: InputProps<T>) {
  if (props.control) {
    return <ControlledInput {...props} control={props.control} name={props.name} />
  }

  return <InputControl {...props} />
}

function ControlledInput<T extends FieldValues>({
  control,
  name,
  error,
  onChange,
  onBlur,
  ref,
  defaultValue,
  ...props
}: InputControlProps & {
  control: Control<T>
  name: FieldPath<T>
}) {
  const { field, fieldState } = useController({
    control,
    name,
    ...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {}),
  })

  return (
    <InputControl
      {...props}
      ref={(node) => {
        field.ref(node)
        assignRef(ref, node)
      }}
      name={field.name}
      value={props.type === "file" ? undefined : (field.value ?? "")}
      onChange={(event) => {
        field.onChange(event)
        onChange?.(event)
      }}
      onBlur={(event) => {
        field.onBlur()
        onBlur?.(event)
      }}
      error={error ?? fieldState.error?.message}
    />
  )
}

function InputControl({
  ref,
  id,
  size = "md",
  variant = "default",
  leftIcon,
  rightIcon,
  label,
  hint,
  error,
  className,
  wrapperClassName,
  disabled,
  type,
  ...inputProps
}: InputControlProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [passwordVisible, setPasswordVisible] = useState(false)
  const isPassword = type === "password"
  const invalid = Boolean(error) || inputProps["aria-invalid"] === true || inputProps["aria-invalid"] === "true"
  const resolvedVariant = invalid ? "error" : variant
  const passwordToggle = isPassword ? (
    <button
      type="button"
      disabled={disabled}
      aria-label={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
      aria-pressed={passwordVisible}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => setPasswordVisible((visible) => !visible)}
      className="inline-flex cursor-pointer items-center justify-center rounded-md text-current hover:text-content-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-input-focus-border disabled:cursor-not-allowed"
    >
      {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  ) : null
  const resolvedRightIcon = rightIcon || passwordToggle ? (
    <>
      {rightIcon}
      {passwordToggle}
    </>
  ) : null
  const dualRight = Boolean(rightIcon) && isPassword

  return (
    <Field id={inputId} label={label} hint={hint} error={error} className={wrapperClassName}>
      <div className="relative">
        {leftIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center [&_button]:pointer-events-auto [&_a]:pointer-events-auto",
              iconSlotClass[size],
              disabled ? "text-input-disabled-content" : fieldIconClass[resolvedVariant],
            )}
          >
            {leftIcon}
          </span>
        ) : null}
        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          type={isPassword && passwordVisible ? "text" : type}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={fieldDescribedBy(inputId, error, hint)}
          data-size={size}
          data-variant={resolvedVariant}
          className={cn(
            "w-full border transition-[color,background-color,border-color,box-shadow] duration-150 outline-none placeholder:text-input-placeholder focus:ring-2 disabled:cursor-not-allowed disabled:border-input-disabled-border disabled:bg-input-disabled-bg disabled:text-input-disabled-content",
            controlSizeClass[size],
            fieldVariantClass[resolvedVariant],
            inputPaddingClass[size][paddingKey(leftIcon, resolvedRightIcon)],
            dualRight && dualRightPaddingClass[size],
            "disabled:hover:border-input-disabled-border",
            className,
          )}
        />
        {resolvedRightIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center [&_button]:pointer-events-auto [&_a]:pointer-events-auto",
              dualRight ? dualRightSlotClass[size] : iconSlotClass[size],
              disabled ? "text-input-disabled-content" : fieldIconClass[resolvedVariant],
            )}
          >
            {resolvedRightIcon}
          </span>
        ) : null}
      </div>
    </Field>
  )
}

const inputPaddingClass: Record<ControlSize, Record<"none" | "left" | "right" | "both", string>> = {
  sm: { none: "px-2.5", left: "pr-2.5 pl-8", right: "pl-2.5 pr-8", both: "px-8" },
  md: { none: "px-3", left: "pr-3 pl-9", right: "pl-3 pr-9", both: "px-9" },
  lg: { none: "px-3.5", left: "pr-3.5 pl-10", right: "pl-3.5 pr-10", both: "px-10" },
}

const dualRightPaddingClass: Record<ControlSize, string> = {
  sm: "pr-14",
  md: "pr-16",
  lg: "pr-20",
}

const dualRightSlotClass: Record<ControlSize, string> = {
  sm: "w-14 gap-0.5 [&_svg]:size-3.5",
  md: "w-16 gap-1 [&_svg]:size-4",
  lg: "w-20 gap-1 [&_svg]:size-5",
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.71 6.71C4.1 8.27 2 12 2 12s4 8 10 8a9.7 9.7 0 004.29-1M2 2l20 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function paddingKey(leftIcon?: ReactNode, rightIcon?: ReactNode) {
  if (leftIcon && rightIcon) return "both"
  if (leftIcon) return "left"
  if (rightIcon) return "right"
  return "none"
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
