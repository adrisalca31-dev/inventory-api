from fastapi import FastAPI

from app.routers import products

app = FastAPI(title="Inventory API")


@app.get("/")
def root():
    return {"message": "Inventory API is running"}


app.include_router(products.router)