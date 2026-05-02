function LoadingScreen() {
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
            <img
                src="/favicon.png"
                alt="AgriPulse"
                className="w-24 h-24 animate-pulse"
            />
            <p className="text-gray-400 text-sm tracking-widest uppercase">Loading...</p>
        </div>
    )
}

export default LoadingScreen