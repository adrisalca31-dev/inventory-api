def test_root(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Inventory API is running"
    }


def test_create_product(client):
    response = client.post(
        "/products",
        json={
            "name": "Laptop",
            "price": 1200.50,
            "stock": 10
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["id"] == 1
    assert data["name"] == "Laptop"
    assert data["price"] == 1200.50
    assert data["stock"] == 10


def test_get_products(client):
    for i in range(5):
        response = client.post(
            "/products",
            json={
                "name": f"Product {i}",
                "price": 100 + i,
                "stock": 10 + i
            }
        )

        assert response.status_code == 201

    response = client.get("/products?skip=0&limit=2")

    assert response.status_code == 200

    data = response.json()

    assert len(data["items"]) == 2
    assert data["total"] == 5
    assert data["items"][0]["name"] == "Product 0"
    assert data["items"][1]["name"] == "Product 1"


def test_get_products_pagination(client):
    for i in range(5):
        response = client.post(
            "/products",
            json={
                "name": f"Product {i}",
                "price": 100 + i,
                "stock": 10 + i
            }
        )

        assert response.status_code == 201

    response = client.get("/products?skip=2&limit=2")

    assert response.status_code == 200

    data = response.json()

    assert len(data["items"]) == 2
    assert data["total"] == 5
    assert data["items"][0]["name"] == "Product 2"
    assert data["items"][1]["name"] == "Product 3"


def test_get_product(client):
    create_response = client.post(
        "/products",
        json={
            "name": "Mouse",
            "price": 25.99,
            "stock": 20
        }
    )

    product_id = create_response.json()["id"]

    response = client.get(f"/products/{product_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == product_id
    assert data["name"] == "Mouse"
    assert data["price"] == 25.99
    assert data["stock"] == 20


def test_get_product_not_found(client):
    response = client.get("/products/999")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Product not found"
    }

def test_get_products_sort_by_price_desc(client):
    products = [
        {
            "name": "Laptop",
            "price": 1200,
            "stock": 5
        },
        {
            "name": "Mouse",
            "price": 25,
            "stock": 20
        },
        {
            "name": "Monitor",
            "price": 300,
            "stock": 10
        }
    ]

    for product in products:
        response = client.post("/products", json=product)
        assert response.status_code == 201

    response = client.get(
        "/products?sort_by=price&order=desc"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 3
    assert data["items"][0]["name"] == "Laptop"
    assert data["items"][1]["name"] == "Monitor"
    assert data["items"][2]["name"] == "Mouse"


def test_get_products_sort_by_name_asc(client):
    products = [
        {
            "name": "Mouse",
            "price": 25,
            "stock": 20
        },
        {
            "name": "Laptop",
            "price": 1200,
            "stock": 5
        },
        {
            "name": "Monitor",
            "price": 300,
            "stock": 10
        }
    ]

    for product in products:
        response = client.post("/products", json=product)
        assert response.status_code == 201

    response = client.get(
        "/products?sort_by=name&order=asc"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 3
    assert data["items"][0]["name"] == "Laptop"
    assert data["items"][1]["name"] == "Monitor"
    assert data["items"][2]["name"] == "Mouse"

def test_get_products_invalid_sort_by(client):
    response = client.get(
        "/products?sort_by=color"
    )

    assert response.status_code == 422


def test_get_products_invalid_order(client):
    response = client.get(
        "/products?sort_by=price&order=random"
    )

    assert response.status_code == 422

def test_update_product(client):
    create_response = client.post(
        "/products",
        json={
            "name": "Keyboard",
            "price": 50.00,
            "stock": 15
        }
    )

    product_id = create_response.json()["id"]

    response = client.put(
        f"/products/{product_id}",
        json={
            "name": "Mechanical Keyboard",
            "price": 85.00,
            "stock": 10
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == product_id
    assert data["name"] == "Mechanical Keyboard"
    assert data["price"] == 85.00
    assert data["stock"] == 10


def test_update_product_not_found(client):
    response = client.put(
        "/products/999",
        json={
            "name": "Keyboard",
            "price": 50.00,
            "stock": 15
        }
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Product not found"
    }


def test_delete_product(client):
    create_response = client.post(
        "/products",
        json={
            "name": "Monitor",
            "price": 300.00,
            "stock": 5
        }
    )

    product_id = create_response.json()["id"]

    response = client.delete(f"/products/{product_id}")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Product deleted successfully"
    }

    get_response = client.get(f"/products/{product_id}")

    assert get_response.status_code == 404


def test_delete_product_not_found(client):
    response = client.delete("/products/999")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Product not found"
    }


def test_create_product_invalid_price(client):
    response = client.post(
        "/products",
        json={
            "name": "Laptop",
            "price": 0,
            "stock": 10
        }
    )

    assert response.status_code == 422


def test_create_product_invalid_stock(client):
    response = client.post(
        "/products",
        json={
            "name": "Laptop",
            "price": 1000,
            "stock": -1
        }
    )

    assert response.status_code == 422


def test_create_product_empty_name(client):
    response = client.post(
        "/products",
        json={
            "name": "",
            "price": 1000,
            "stock": 10
        }
    )

    assert response.status_code == 422