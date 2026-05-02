import { useEffect, useState } from "react"
import { getSummary } from "../api"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function SeasonalityChart({ commodity }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!commodity) return
        setLoading(true)
        getSummary(commodity)
            .then(raw => {
                // Average across all years per month
                const monthMap = {}
                raw.forEach(row => {
                    if (!monthMap[row.month]) monthMap[row.month] = []
                    monthMap[row.month].push(row.avg)
                })
                const aggregated = Object.entries(monthMap).map(([month, prices]) => ({
                    month: MONTHS[parseInt(month) - 1],
                    avg: parseFloat(
                        (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
                    )
                }))
                setData(aggregated)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [commodity])

    if (loading) return <p className="text-gray-400 mt-6">Loading seasonality...</p>
    if (error) return <p className="text-red-400 mt-6">{error}</p>

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">
                Monthly Seasonality — {commodity}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "none",
                            borderRadius: "8px"
                        }}
                    />
                    <Bar dataKey="avg" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default SeasonalityChart