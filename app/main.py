from fastapi import FastAPI

from app.schemas import ProductCreate

app = FastAPI(title="Inventory API")

@app.get("/")
def root():
    return {"message": "Inventory API is running"}

@app.post("/products")
def create_product(product: ProductCreate):
    return product