export const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

export function formatCurrencyInput(value: number | null | undefined) {
    if (value == null || Number.isNaN(value)) return ""
    return currency.format(value)
}

export function parseCurrencyInput(raw: string) {
    const digits = raw.replace(/\D/g, "")
    if (!digits) return null
    return Number((Number(digits) / 100).toFixed(2))
}

export function phoneDigits(phone: string) {
    return phone.replace(/\D/g, "").slice(0, 11)
}

export function maskPhone(phone: string) {
    const digits = phoneDigits(phone)
    if (digits.length === 0) return ""
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function formatPhone(phone: string) {
    const digits = phone.replace(/\D/g, "")
    if (digits.length === 10 || digits.length === 11) return maskPhone(digits)
    return phone
}