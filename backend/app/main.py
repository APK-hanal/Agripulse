from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import prices

app = FastAPI(title="AgriPulse Nepal")

# tighten this later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prices.router)