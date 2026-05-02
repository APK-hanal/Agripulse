import { useState } from "react";
import CommoditySelector  from "./components/CommoditySelector";
import PriceTrendChart from "./components/PriceTrendChart";
import SeasonalityChart from "./components/SeasonalityChart";
import LoadingScreen from "./components/LoadingScreen";

function App(){
    const [selectedComm, setComm] = useState("")
    const [appReady, setAppReady]= useState(false)

    return (
        <>
        {!appReady && <LoadingScreen/>}
        <div className={`min-h-screen bg-gray-950 text-white p-4 max-w-5xl mx-auto ${!appReady ? "hidden" : ""}`}>
            <h1 className="text-2xl font-bold mb-6 text-center">AgriPulse Nepal</h1>
            <CommoditySelector
                selected={selectedComm}
                onSelect={setComm}
                onReady ={()=> setAppReady(true) }
            />
            {selectedComm && (
                <>
                    <PriceTrendChart commodity={selectedComm}/>
                    <SeasonalityChart commodity={selectedComm}/>
                    </>

            )}
            </div>
            </>
    )}
export default App