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

    useEffect(() => {
        if (!commodity) return
        setLoading(true)
        getPrices(commodity)
            .then(data => {
                setData(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [commodity])

    if (loading) return <p className="text-gray-400 mt-6">Loading prices...</p>
    if (error) return <p className="text-red-400 mt-6">{error}</p>

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">
                Price Trend — {commodity}
            </h2>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: "#9ca3af", fontSize: 11 }}
                        tickFormatter={val => val.slice(0, 7)}
                        interval={180}
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
                    <Line type="monotone" dataKey="avg" stroke="#22c55e" dot={false} />
                    <Line type="monotone" dataKey="min" stroke="#3b82f6" dot={false} />
                    <Line type="monotone" dataKey="max" stroke="#ef4444" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default PriceTrendChart