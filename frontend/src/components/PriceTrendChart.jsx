import { useEffect, useState } from "react"
import { getPrices } from "../api"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts"

function PriceTrendChart({ commodity }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [start, setStart] = useState("2024-01-01")
    const [end, setEnd] = useState("2025-06-29")

    useEffect(() => {
        if (!commodity) return
        setLoading(true)
        getPrices(commodity, start, end)
            .then(data => {
                setData(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [commodity, start, end])

    if (error) return <p className="text-red-400 mt-6">{error}</p>

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Price Trend — {commodity}</h2>

            <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">From</label>
                    <input
                        type="date"
                        value={start}
                        max={end}
                        onChange={e => setStart(e.target.value)}
                        className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">To</label>
                    <input
                        type="date"
                        value={end}
                        min={start}
                        max="2025-06-29"
                        onChange={e => setEnd(e.target.value)}
                        className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                    />
                </div>
            </div>

            {loading ? (
                <div className="w-full h-[350px] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin"/>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: "#9ca3af", fontSize: 11 }}
                            tickFormatter={val => val.slice(0, 7)}
                            interval={30}
                        />
                        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "none",
                                borderRadius: "8px"
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="average" stroke="#22c55e" dot={false} />
                        <Line type="monotone" dataKey="min" stroke="#3b82f6" dot={false} />
                        <Line type="monotone" dataKey="max" stroke="#ef4444" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

export default PriceTrendChart