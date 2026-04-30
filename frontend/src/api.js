const BASE_URL = "http://localhost:8000"

export async function getCommodities() {
    const res = await fetch(`${BASE_URL}/commodities`)
    if (!res.ok) throw new Error("Failed to fetch commodities")
    return res.json()
}

export async function getPrices(commodity, start = null, end = null) {
    let url = `${BASE_URL}/prices/${commodity}`
    const params = new URLSearchParams()
    if (start) params.append("start", start)
    if (end) params.append("end", end)
    if ([...params].length > 0) url += `?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch prices")
    return res.json()
}

export async function getSummary(commodity) {
    const res = await fetch(`${BASE_URL}/prices/${commodity}/summary`)
    if (!res.ok) throw new Error("Failed to fetch summary")
    return res.json()
}