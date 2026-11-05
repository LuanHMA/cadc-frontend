import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { useController } from "react-hook-form"
import { Input } from "."
import { formatCurrencyInput, parseCurrencyInput } from "../../utils/formatations"

type CurrencyInputProps<T extends FieldValues> = {
    control: Control<T>
    name: FieldPath<T>
    label: string
    placeholder?: string
}

export function CurrencyInput<T extends FieldValues>({ control, name, label, placeholder = "R$ 0,00" }: CurrencyInputProps<T>) {
    const { field, fieldState } = useController({ control, name })
    const value = typeof field.value === "number" ? field.value : null

    return (
        <Input
            ref={field.ref}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            label={label}
            placeholder={placeholder}
            name={field.name}
            value={formatCurrencyInput(value)}
            error={fieldState.error?.message}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(parseCurrencyInput(event.target.value))}
        />
    )
}
