from fastapi import FastAPI

from app.database import SessionLocal
from app.schemas import ProductCreate, ProductUpdate
from app.crud import (
    create_product as crud_create_product,
    get_products as crud_get_products,
    update_product as crud_update_product,
    delete_product as crud_delete_product,
)

app = FastAPI(title="Inventory API")


@app.get("/")
def root():
    return {"message": "Inventory API is running"}


@app.post("/products")
def create_product(product: ProductCreate):
    db = SessionLocal()

    db_product = crud_create_product(db, product)

    db.close()

    return db_product


@app.get("/products")
def get_products():
    db = SessionLocal()

    products = crud_get_products(db)

    db.close()

    return products


@app.put("/products/{product_id}")
def update_product(product_id: int, product: ProductUpdate):
    db = SessionLocal()

    db_product = crud_update_product(db, product_id, product)

    if db_product is None:
        db.close()
        return {"error": "Product not found"}

    db.close()

    return db_product


@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    db = SessionLocal()

    deleted = crud_delete_product(db, product_id)

    db.close()

    if not deleted:
        return {"message": "Product not found"}

    return {"message": "Product deleted successfully"}