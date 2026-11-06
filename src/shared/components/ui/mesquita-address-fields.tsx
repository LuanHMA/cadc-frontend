import { useEffect, useRef, useState } from "react"
import { useController, type Control } from "react-hook-form"
import { Input } from "."
import type { CustomerFormSchemaType } from "../../../modules/customers/contracts/customers-contracts"
import { searchMesquitaStreets, type MesquitaStreet } from "../../services/mesquita-streets"

export function MesquitaAddressFields({ control }: { control: Control<CustomerFormSchemaType> }) {
    const street = useController({ control, name: "street" })
    const district = useController({ control, name: "district" })
    const [query, setQuery] = useState(street.field.value)
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<MesquitaStreet[]>([])
    const [status, setStatus] = useState<"idle" | "loading" | "empty" | "error">("idle")
    const selectedStreet = useRef(street.field.value)
    const streetValue = street.field.value
    const districtValue = district.field.value
    const listOpen = open && query.trim().length >= 3 && query.trim() !== streetValue

    useEffect(() => {
        if (!streetValue && query === selectedStreet.current) setQuery("")
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
                    setStatus(streets.length === 0 ? "empty" : "idle")
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

    function selectStreet(option: MesquitaStreet) {
        setQuery(option.logradouro)
        street.field.onChange(option.logradouro)
        district.field.onChange(option.bairro)
        setOpen(false)
    }

    function onQueryChange(value: string) {
        setQuery(value)
        setOpen(true)
        if (value.trim() === streetValue) return
        street.field.onChange("")
        district.field.onChange("")
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
                        value={query}
                        error={street.fieldState.error?.message}
                        onBlur={() => {
                            street.field.onBlur()
                            setOpen(false)
                        }}
                        onFocus={() => setOpen(true)}
                        onChange={(event) => onQueryChange(event.target.value)}
                    />
                    {listOpen ? (
                        <div className="mt-1 max-h-52 overflow-y-auto rounded-lg border border-brd-default bg-background-elevated shadow-lg">
                            {status === "loading" ? <p className="px-3 py-2 text-sm text-content-muted">Buscando ruas em Mesquita...</p> : null}
                            {status === "error" ? <p className="px-3 py-2 text-sm text-content-danger">Não foi possível buscar o endereço.</p> : null}
                            {status === "empty" ? <p className="px-3 py-2 text-sm text-content-muted">Nenhuma rua de Mesquita encontrada.</p> : null}
                            {options.length > 0 ? (
                                <ul>
                                    {options.map((option) => (
                                        <li key={`${option.cep}-${option.bairro}-${option.complemento}`}>
                                            <button
                                                type="button"
                                                className="flex w-full flex-col px-3 py-2 text-left hover:bg-background-base"
                                                onMouseDown={(event) => event.preventDefault()}
                                                onClick={() => selectStreet(option)}
                                            >
                                                <span className="text-sm font-medium text-content-primary">{option.logradouro}</span>
                                                <span className="text-sm text-content-muted">
                                                    {option.bairro}{option.complemento ? ` · ${option.complemento}` : ""}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    ) : null}
                </div>
                <Input label="Número" placeholder="123" control={control} name="house_number" />
            </div>
            {districtValue ? (
                <p className="text-sm text-content-muted">
                    Bairro: <span className="font-medium text-content-primary">{districtValue}</span>, Mesquita
                </p>
            ) : null}
        </div>
    )
}
