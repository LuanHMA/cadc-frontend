export type MesquitaStreet = {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
}

type StreetRange = {
    min: number | null
    max: number | null
    side: "par" | "impar" | null
}

export function parseHouseNumber(value: string) {
    const match = value.trim().match(/^([1-9]\d*)[a-zA-Z]?$/)
    if (!match?.[1]) return null
    const number = Number(match[1])
    return Number.isSafeInteger(number) ? number : null
}

export function houseNumberRangeMessage(houseNumber: string, complemento: string) {
    const number = parseHouseNumber(houseNumber)
    const range = parseComplementRange(complemento)
    if (number == null || range == null) return null
    if (range.min != null && number < range.min) {
        return `Esse trecho começa no número ${range.min} (${complemento}).`
    }
    if (range.max != null && number > range.max) {
        return `Esse trecho vai até o número ${range.max} (${complemento}).`
    }
    if (range.side === "par" && number % 2 !== 0) {
        return `Esse trecho é só o lado par (${complemento}).`
    }
    if (range.side === "impar" && number % 2 === 0) {
        return `Esse trecho é só o lado ímpar (${complemento}).`
    }
    return null
}

export function complementForSelection(streets: MesquitaStreet[], logradouro: string, bairro: string, houseNumber: string) {
    const samePlace = streets.filter((street) => sameText(street.logradouro, logradouro) && sameText(street.bairro, bairro))
    if (samePlace.length === 0) return null

    const number = parseHouseNumber(houseNumber)
    if (number == null) return null

    const containing = samePlace.find((street) => {
        const range = parseComplementRange(street.complemento)
        return range != null && rangeContains(range, number)
    })
    if (containing) return containing.complemento

    const ranged = samePlace.find((street) => parseComplementRange(street.complemento) != null)
    if (ranged) return ranged.complemento
    return samePlace[0]?.complemento ?? ""
}

export function isMesquitaStreet(value: unknown): value is MesquitaStreet {
    if (!value || typeof value !== "object") return false
    const street = value as Partial<MesquitaStreet>
    return street.localidade === "Mesquita"
        && street.uf === "RJ"
        && typeof street.logradouro === "string"
        && street.logradouro.trim().length > 0
        && typeof street.bairro === "string"
        && street.bairro.trim().length > 0
        && typeof street.cep === "string"
        && typeof street.complemento === "string"
}

function parseComplementRange(complemento: string): StreetRange | null {
    const text = complemento.trim().toLocaleLowerCase("pt-BR")
    if (!text) return null

    const withoutOdd = text.replaceAll("ímpar", "").replaceAll("impar", "")
    const side = text.includes("ímpar") || text.includes("impar")
        ? "impar"
        : withoutOdd.includes("par")
            ? "par"
            : null
    const between = text.match(/de\s+(\d+)\s+a(?:o)?\s+(\d+|fim)/)
    const until = text.match(/até\s+(\d+)/)
    if (!between && !until && !side) return null

    if (between?.[1] && between[2]) {
        return {
            min: Number(between[1]),
            max: between[2] === "fim" ? null : Number(between[2]),
            side,
        }
    }

    if (until?.[1]) return { min: null, max: Number(until[1]), side }
    return { min: null, max: null, side }
}

function rangeContains(range: StreetRange, number: number) {
    if (range.min != null && number < range.min) return false
    if (range.max != null && number > range.max) return false
    if (range.side === "par" && number % 2 !== 0) return false
    if (range.side === "impar" && number % 2 === 0) return false
    return true
}

function sameText(left: string, right: string) {
    return left.trim().toLocaleLowerCase("pt-BR") === right.trim().toLocaleLowerCase("pt-BR")
}
