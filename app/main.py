from fastapi import FastAPI
from app.database import SessionLocal
from app.models import Product
from app.schemas import ProductCreate

app = FastAPI(title="Inventory API")

@app.get("/")
def root():
    return {"message": "Inventory API is running"}

@app.post("/products")
def create_product(product: ProductCreate):
    db = SessionLocal()

    db_product = Product(
        name=product.name,
        price=product.price,
        stock=product.stock
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    db.close()

    return db_product