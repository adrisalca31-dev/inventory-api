from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ErrorResponse,
)
from app.crud import (
    create_product as crud_create_product,
    get_products as crud_get_products,
    get_product as crud_get_product,
    update_product as crud_update_product,
    delete_product as crud_delete_product,
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=ProductResponse
)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    return crud_create_product(db, product)


@router.get("", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return crud_get_products(db)

@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    responses={404: {"model": ErrorResponse}}
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    db_product = crud_get_product(db, product_id)

    if db_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return db_product

@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    responses={404: {"model": ErrorResponse}}
)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):
    db_product = crud_update_product(db, product_id, product)

    if db_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return db_product


@router.delete(
    "/{product_id}",
    responses={404: {"model": ErrorResponse}}
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    deleted = crud_delete_product(db, product_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return {"message": "Product deleted successfully"}