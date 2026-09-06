from typing import Literal

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.exceptions import product_not_found
from app.database import get_db
from app.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
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


@router.get(
    "",
    response_model=ProductListResponse,
    summary="List products",
    description=(
        "Retrieve products with optional pagination, sorting, "
        "search, and stock filters."
    )
)
def get_products(
    skip: int = Query(
        default=0,
        ge=0,
        description="Number of products to skip before returning results."
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Maximum number of products to return."
    ),
    sort_by: Literal["name", "price", "stock"] = Query(
        default="name",
        description="Field used to sort the products."
    ),
    order: Literal["asc", "desc"] = Query(
        default="asc",
        description="Sort direction: ascending or descending."
    ),
    search: str | None = Query(
        default=None,
        min_length=1,
        description="Search products by name."
    ),
    min_stock: int | None = Query(
        default=None,
        ge=0,
        description="Return products with stock greater than or equal to this value."
    ),
    max_stock: int | None = Query(
        default=None,
        ge=0,
        description="Return products with stock less than or equal to this value."
    ),
    db: Session = Depends(get_db)
):
    return crud_get_products(
        db,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        order=order,
        search=search,
        min_stock=min_stock,
        max_stock=max_stock
    )


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
        raise product_not_found()

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
        raise product_not_found()

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
        raise product_not_found()

    return {"message": "Product deleted successfully"}