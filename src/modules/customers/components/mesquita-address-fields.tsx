import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { useController, type Control } from "react-hook-form"
import { Input } from "../../../shared/components/ui"
import type { CustomerFormSchemaType } from "../contracts/customers-contracts"
import { complementForSelection, houseNumberRangeMessage, type MesquitaStreet } from "../lib/mesquita-address"
import { searchMesquitaStreets } from "../services/mesquita-streets"

export function MesquitaAddressFields({ control }: { control: Control<CustomerFormSchemaType> }) {
    const street = useController({ control, name: "street" })
    const houseNumber = useController({ control, name: "house_number" })
    const district = useController({ control, name: "district" })
    const complement = useController({ control, name: "street_complement" })
    const [query, setQuery] = useState(street.field.value)
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<MesquitaStreet[]>([])
    const [status, setStatus] = useState<"idle" | "loading" | "ready" | "empty" | "error">("idle")
    const [activeIndex, setActiveIndex] = useState(0)
    const segments = useRef<{ street: string, results: MesquitaStreet[] } | null>(null)
    const complementValue = useRef(complement.field.value)
    const setComplement = useRef(complement.field.onChange)
    const listId = useId()
    const streetValue = street.field.value
    const districtValue = district.field.value
    const houseNumberValue = houseNumber.field.value
    complementValue.current = complement.field.value
    setComplement.current = complement.field.onChange

    const listOpen = open && query.trim().length >= 3 && query.trim() !== streetValue
    const rangeMessage = houseNumberRangeMessage(houseNumberValue, complement.field.value)
    const selectedStreet = useRef(streetValue)

    useEffect(() => {
        if (!streetValue && selectedStreet.current && query === selectedStreet.current) setQuery("")
        selectedStreet.current = streetValue
    }, [streetValue, query])

    useEffect(() => {
        const term = query.trim()
        if (term.length < 3 || term === streetValue) {
            setOptions([])
            setStatus("idle")
            return
        }

        const controller = new AbortController()
        const timer = window.setTimeout(() => {
            setStatus("loading")
            searchMesquitaStreets(term, controller.signal)
                .then((streets) => {
                    if (controller.signal.aborted) return
                    setOptions(streets)
                    setStatus(streets.length === 0 ? "empty" : "ready")
                    setActiveIndex(0)
                })
                .catch((error: unknown) => {
                    if (error instanceof DOMException && error.name === "AbortError") return
                    setOptions([])
                    setStatus("error")
                })
        }, 300)

        return () => {
            controller.abort()
            window.clearTimeout(timer)
        }
    }, [query, streetValue])

    useEffect(() => {
        if (!streetValue || !districtValue) return

        const controller = new AbortController()
        const timer = window.setTimeout(() => {
            const apply = (results: MesquitaStreet[]) => {
                if (controller.signal.aborted) return
                const next = complementForSelection(results, streetValue, districtValue, houseNumberValue)
                if (next == null || next === complementValue.current) return
                setComplement.current(next)
            }

            const cached = segments.current
            if (cached?.street === streetValue) {
                apply(cached.results)
                return
            }

            searchMesquitaStreets(streetValue, controller.signal)
                .then((results) => {
                    segments.current = { street: streetValue, results }
                    apply(results)
                })
                .catch((error: unknown) => {
                    if (error instanceof DOMException && error.name === "AbortError") return
                })
        }, 300)

        return () => {
            controller.abort()
            window.clearTimeout(timer)
        }
    }, [streetValue, districtValue, houseNumberValue])

    function selectStreet(option: MesquitaStreet) {
        setQuery(option.logradouro)
        street.field.onChange(option.logradouro)
        district.field.onChange(option.bairro)
        complement.field.onChange(option.complemento)
        setOpen(false)
    }

    function onQueryChange(value: string) {
        setQuery(value)
        setOpen(true)
        setActiveIndex(0)
        if (value.trim() === streetValue) return
        street.field.onChange("")
        district.field.onChange("")
        complement.field.onChange("")
        segments.current = null
    }

    function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Escape") {
            setOpen(false)
            return
        }
        if (!listOpen || options.length === 0) return
        if (event.key === "ArrowDown") {
            event.preventDefault()
            setActiveIndex((index) => (index + 1) % options.length)
        }
        if (event.key === "ArrowUp") {
            event.preventDefault()
            setActiveIndex((index) => (index - 1 + options.length) % options.length)
        }
        if (event.key === "Enter") {
            event.preventDefault()
            const option = options[activeIndex]
            if (option) selectStreet(option)
        }
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-[minmax(0,1fr)_7rem] items-start gap-2">
                <div>
                    <Input
                        ref={street.field.ref}
                        label="Endereço"
                        placeholder="Ex: Rua Ambrósio"
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={listOpen}
                        aria-autocomplete="list"
                        aria-controls={listId}
                        value={query}
                        error={street.fieldState.error?.message}
                        onBlur={() => {
                            street.field.onBlur()
                            setOpen(false)
                        }}
                        onFocus={() => setOpen(true)}
                        onChange={(event) => onQueryChange(event.target.value)}
                        onKeyDown={onKeyDown}
                    />
                    {listOpen ? (
                        <div
                            id={listId}
                            className="mt-1 max-h-52 overflow-y-auto rounded-lg border border-brd-default bg-background-elevated shadow-lg"
                        >
                            {status === "loading" ? <p className="px-3 py-2 text-sm text-content-muted">Buscando ruas em Mesquita...</p> : null}
                            {status === "error" ? <p className="px-3 py-2 text-sm text-content-danger">Não foi possível buscar o endereço.</p> : null}
                            {status === "empty" ? <p className="px-3 py-2 text-sm text-content-muted">Nenhuma rua de Mesquita encontrada.</p> : null}
                            {status === "ready" ? (
                                <ul role="listbox">
                                    {options.map((option, index) => {
                                        const selected = index === activeIndex
                                        return (
                                            <li key={`${option.cep}-${option.bairro}-${option.complemento}`} role="presentation">
                                                <button
                                                    type="button"
                                                    role="option"
                                                    aria-selected={selected}
                                                    className={`flex w-full flex-col px-3 py-2 text-left ${selected ? "bg-btn-outline-hover-bg" : "hover:bg-background-base"}`}
                                                    onMouseDown={(event) => event.preventDefault()}
                                                    onMouseEnter={() => setActiveIndex(index)}
                                                    onClick={() => selectStreet(option)}
                                                >
                                                    <span className="text-sm font-medium text-content-primary">{option.logradouro}</span>
                                                    <span className="text-sm text-content-muted">
                                                        {option.bairro}{option.complemento ? ` · ${option.complemento}` : ""}
                                                    </span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : null}
                        </div>
                    ) : null}
                </div>
                <Input
                    ref={houseNumber.field.ref}
                    label="Número"
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="off"
                    name={houseNumber.field.name}
                    value={houseNumberValue}
                    error={houseNumber.fieldState.error?.message ?? rangeMessage ?? undefined}
                    onBlur={houseNumber.field.onBlur}
                    onChange={(event) => houseNumber.field.onChange(sanitizeHouseNumber(event.target.value))}
                />
            </div>
            {districtValue ? (
                <p className="text-sm text-content-muted">
                    Bairro: <span className="font-medium text-content-primary">{districtValue}</span>, Mesquita
                </p>
            ) : null}
        </div>
    )
}

function sanitizeHouseNumber(value: string) {
    const match = value.replace(/[^\da-zA-Z]/g, "").match(/^(\d{0,6})([a-zA-Z]?)/)
    const digits = (match?.[1] ?? "").replace(/^0+/, "")
    return `${digits}${match?.[2] ?? ""}`
}
