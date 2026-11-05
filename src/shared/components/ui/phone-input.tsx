import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { useController } from "react-hook-form"
import { maskPhone, phoneDigits } from "../../utils/formatations"
import { Input } from "."

type PhoneInputProps<T extends FieldValues> = {
    control: Control<T>
    name: FieldPath<T>
    label: string
    placeholder?: string
}

export function PhoneInput<T extends FieldValues>({ control, name, label, placeholder = "(00) 00000-0000" }: PhoneInputProps<T>) {
    const { field, fieldState } = useController({ control, name })
    const value = typeof field.value === "string" ? field.value : ""

    return (
        <Input
            ref={field.ref}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            label={label}
            placeholder={placeholder}
            name={field.name}
            value={maskPhone(value)}
            error={fieldState.error?.message}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(phoneDigits(event.target.value))}
        />
    )
}
