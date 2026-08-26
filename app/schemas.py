from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str
    price: float = Field(gt=0)
    stock: int = Field(ge=0)

class ProductUpdate(ProductCreate):
    pass

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    stock: int

    model_config = {
        "from_attributes": True
    }