from sqlalchemy import select
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


def get_products(db: Session):
    statement = select(Product)

    result = db.execute(statement)

    return result.scalars().all()


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