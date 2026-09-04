from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Product
from app.schemas import ProductCreate, ProductUpdate


def create_product(db: Session, product: ProductCreate):
    db_product = Product(
        name=product.name,
        price=product.price,
        stock=product.stock
    )

    try:
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
    except Exception:
        db.rollback()
        raise

    return db_product


def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    sort_by: str = "name",
    order: str = "asc",
    search: str | None = None
):
    count_statement = select(func.count()).select_from(Product)

    statement = select(Product)

    if search:
        search_pattern = f"%{search}%"

        count_statement = count_statement.where(
            Product.name.ilike(search_pattern)
        )

        statement = statement.where(
            Product.name.ilike(search_pattern)
        )

    total = db.execute(count_statement).scalar_one()

    sort_column = getattr(Product, sort_by)

    if order == "desc":
        sort_column = sort_column.desc()
    else:
        sort_column = sort_column.asc()

    statement = (
        statement
        .order_by(sort_column)
        .offset(skip)
        .limit(limit)
    )

    result = db.execute(statement)
    products = result.scalars().all()

    return {
        "items": products,
        "total": total
    }


def get_product(db: Session, product_id: int):
    statement = select(Product).where(Product.id == product_id)

    result = db.execute(statement)

    return result.scalar_one_or_none()


def update_product(db: Session, product_id: int, product: ProductUpdate):
    statement = select(Product).where(Product.id == product_id)

    result = db.execute(statement)

    db_product = result.scalar_one_or_none()

    if db_product is None:
        return None

    db_product.name = product.name
    db_product.price = product.price
    db_product.stock = product.stock

    try:
        db.commit()
        db.refresh(db_product)
    except Exception:
        db.rollback()
        raise

    return db_product


def delete_product(db: Session, product_id: int):
    statement = select(Product).where(Product.id == product_id)

    result = db.execute(statement)

    product = result.scalar_one_or_none()

    if product is None:
        return False

    try:
        db.delete(product)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return True