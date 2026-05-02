import { useEffect, useState, useRef } from "react"
import { getCommodities } from "../api"

function CommoditySelector({ onSelect, selected }) {
    const [commodities, setCommodities] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

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

    //Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filtered = commodities.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <p className="text-gray-400">Loading commodities...</p>
    if (error) return <p className="text-red-400">{error}</p>

    return (
        <div className="relative w-64" ref={ref}>
            <label className="text-sm text-gray-400 mb-1 block">Select Commodity</label>
            <input
                type="text"
                placeholder={selected || "Search commodity..."}
                value={search}
                onFocus={() => setOpen(true)}
                onChange={e => {
                    setSearch(e.target.value)
                    setOpen(true)
                }}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
            />
            {open && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-y-auto max-h-60">
                    {filtered.length === 0 ? (
                        <p className="text-gray-400 px-3 py-2 text-sm">No results</p>
                    ) : (
                        filtered.map(c => (
                            <div
                                key={c.name}
                                onClick={() => {
                                    onSelect(c.name)
                                    setSearch("")
                                    setOpen(false)
                                }}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-700 text-sm"
                            >
                                {c.name} <span className="text-gray-400">({c.category})</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default CommoditySelector