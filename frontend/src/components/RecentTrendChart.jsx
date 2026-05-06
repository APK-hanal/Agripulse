import { useEffect, useState } from "react"
import { getRecentPrices } from "../api"
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

function RecentTrendChart({ commodity }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!commodity) return
        setLoading(true)
        getRecentPrices(commodity)
            .then(data => {
                setData(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [commodity])

    if (error) return <p className="text-red-400 mt-6">{error}</p>

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-1">This Week — {commodity}</h2>
            <p className="text-xs text-gray-400 mb-4">Price trend over the last 7 days</p>

            {loading ? (
                <div className="w-full h-[300px] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin"/>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: "#9ca3af", fontSize: 11 }}
                            tickFormatter={val => val.slice(5)}
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
                        <Line type="monotone" dataKey="average" stroke="#22c55e" dot={true} strokeWidth={2} />
                        <Line type="monotone" dataKey="min" stroke="#3b82f6" dot={true} strokeWidth={2} />
                        <Line type="monotone" dataKey="max" stroke="#ef4444" dot={true} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

export default RecentTrendChart