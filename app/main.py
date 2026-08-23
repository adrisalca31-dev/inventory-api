from fastapi import FastAPI

from app.database import SessionLocal
from app.models import Product
from app.schemas import ProductCreate, ProductUpdate

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

@app.get("/products")
def get_products():
    db = SessionLocal()

    products = db.query(Product).all()

    db.close()

    return products

@app.put("/products/{product_id}")
def update_product(product_id: int, product: ProductUpdate):
    db = SessionLocal()

    db_product = db.query(Product).filter(Product.id == product_id).first()

    if db_product is None:
        db.close()
        return {"error": "Product not found"}

    db_product.name = product.name
    db_product.price = product.price
    db_product.stock = product.stock

    db.commit()
    db.refresh(db_product)

    db.close()

    return db_product

@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    db = SessionLocal()

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        db.close()
        return {"message": "Product not found"}

    db.delete(product)
    db.commit()

    db.close()

    return {"message": "Product deleted successfully"}