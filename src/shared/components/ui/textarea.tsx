import { useId, type ComponentProps, type ReactNode } from "react"
import { type Control, type FieldPath, type FieldValues, useController } from "react-hook-form"
import { cn } from "./cn.ts"
import { Field } from "./field.tsx"
import { type FieldVariant, fieldDescribedBy, fieldVariantClass } from "./styles.ts"

type TextareaControlProps = ComponentProps<"textarea"> & {
  variant?: FieldVariant
  label?: ReactNode
  hint?: ReactNode
  error?: string
  wrapperClassName?: string
}

export type TextareaProps<T extends FieldValues = FieldValues> = TextareaControlProps &
  (
    | {
        control: Control<T>
        name: FieldPath<T>
      }
    | {
        control?: undefined
      }
  )

export function Textarea<T extends FieldValues>(props: TextareaProps<T>) {
  if (props.control) {
    return <ControlledTextarea {...props} control={props.control} name={props.name} />
  }

  return <TextareaControl {...props} />
}

function ControlledTextarea<T extends FieldValues>({
  control,
  name,
  error,
  onChange,
  onBlur,
  ...props
}: TextareaControlProps & {
  control: Control<T>
  name: FieldPath<T>
}) {
  const { field, fieldState } = useController({ control, name })

  return (
    <TextareaControl
      {...props}
      ref={(node) => field.ref(node)}
      name={field.name}
      value={field.value ?? ""}
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

function TextareaControl({
  id,
  variant = "default",
  label,
  hint,
  error,
  className,
  wrapperClassName,
  ...textareaProps
}: TextareaControlProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const resolvedVariant = error ? "error" : variant

  return (
    <Field id={textareaId} label={label} hint={hint} error={error} className={wrapperClassName}>
      <textarea
        {...textareaProps}
        id={textareaId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={fieldDescribedBy(textareaId, error, hint)}
        className={cn(
          "min-h-24 w-full resize-y rounded-lg border px-3 py-2 text-sm transition-[color,background-color,border-color,box-shadow] duration-150 outline-none placeholder:text-input-placeholder focus:ring-2 disabled:cursor-not-allowed disabled:border-input-disabled-border disabled:bg-input-disabled-bg disabled:text-input-disabled-content",
          fieldVariantClass[resolvedVariant],
          className,
        )}
      />
    </Field>
  )
}
