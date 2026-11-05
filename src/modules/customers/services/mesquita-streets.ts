import { isMesquitaStreet, type MesquitaStreet } from "../lib/mesquita-address"

const MESQUITA_STREETS_URL = "https://viacep.com.br/ws/RJ/Mesquita"

export async function searchMesquitaStreets(query: string, signal: AbortSignal): Promise<MesquitaStreet[]> {
    const term = query.trim().replace(/\s+/g, " ")
    if (term.length < 3) return []

    const response = await fetch(`${MESQUITA_STREETS_URL}/${encodeURIComponent(term)}/json/`, { signal })
    if (!response.ok) throw new Error("Não foi possível buscar o endereço.")

    const data: unknown = await response.json()
    if (!Array.isArray(data)) return []
    return data.filter(isMesquitaStreet)
}
