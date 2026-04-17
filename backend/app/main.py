import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.analises import router as analises_router
from app.routes.autenticacao import router as auth_router

app = FastAPI(
    title="API de Análise de Crédito",
    version="1.0.0"
)

API_FRONT_URL = os.getenv("API_FRONT_URL")
# API_FRONT_URL = "http://localhost:5173"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[API_FRONT_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analises_router)
app.include_router(auth_router)