from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import ProductCreate, ProductUpdate
from app.crud import (
    create_product as crud_create_product,
    get_products as crud_get_products,
    update_product as crud_update_product,
    delete_product as crud_delete_product,
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post("")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    return crud_create_product(db, product)


@router.get("")
def get_products(db: Session = Depends(get_db)):
    return crud_get_products(db)


@router.put("/{product_id}")
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):
    db_product = crud_update_product(db, product_id, product)

    if db_product is None:
        return {"error": "Product not found"}

    return db_product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    deleted = crud_delete_product(db, product_id)

    if not deleted:
        return {"message": "Product not found"}

    return {"message": "Product deleted successfully"}