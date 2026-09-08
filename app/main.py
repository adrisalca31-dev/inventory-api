from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import products


app = FastAPI(title="Inventory API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Inventory API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(products.router)