import { useEffect, useState } from "react"
import { getCommodities } from "../api"

function CommoditySelector({ onSelect, selected }) {
    const [commodities, setCommodities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getCommodities()
            .then(data => {
                setCommodities(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    if (loading) return <p className="text-gray-400">Loading commodities...</p>
    if (error) return <p className="text-red-400">{error}</p>

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Select Commodity</label>
            <select
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                value={selected}
                onChange={e => onSelect(e.target.value)}
            >
                <option value="">-- Select --</option>
                {commodities.map(c => (
                    <option key={c.name} value={c.name}>
                        {c.name} ({c.category})
                    </option>
                ))}
            </select>
        </div>
    )
}

export default CommoditySelector