import { useState } from "react"
import CommoditySelector from "./components/CommoditySelector"
import RecentTrendChart from "./components/RecentTrendChart"
import PriceTrendChart from "./components/PriceTrendChart"
import SeasonalityChart from "./components/SeasonalityChart"
import LoadingScreen from "./components/LoadingScreen"

function App() {
    const [selectedCommodity, setSelectedCommodity] = useState("")
    const [appReady, setAppReady] = useState(false)
    const [view, setView] = useState("recent")

    return (
        <>
            {!appReady && <LoadingScreen />}
            <div className={`min-h-screen bg-gray-950 text-white p-4 max-w-5xl mx-auto ${!appReady ? "hidden" : ""}`}>
                <h1 className="text-2xl font-bold mb-6 text-center">AgriPulse Nepal</h1>
                <CommoditySelector
                    selected={selectedCommodity}
                    onSelect={setSelectedCommodity}
                    onReady={() => setAppReady(true)}
                />

                {selectedCommodity && (
                    <>
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setView("recent")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === "recent" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                            >
                                This Week
                            </button>
                            <button
                                onClick={() => setView("historical")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === "historical" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                            >
                                Historical
                            </button>
                        </div>

                        {view === "recent" && (
                            <RecentTrendChart commodity={selectedCommodity} />
                        )}

                        {view === "historical" && (
                            <>
                                <PriceTrendChart commodity={selectedCommodity} />
                                <SeasonalityChart commodity={selectedCommodity} />
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default App