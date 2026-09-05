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


def test_get_products_search_by_name(client):
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
            "name": "Gaming Laptop",
            "price": 1500,
            "stock": 3
        }
    ]

    for product in products:
        response = client.post("/products", json=product)
        assert response.status_code == 201

    response = client.get("/products?search=laptop")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 2
    assert len(data["items"]) == 2
    assert data["items"][0]["name"] == "Gaming Laptop"
    assert data["items"][1]["name"] == "Laptop"


def test_get_products_search_case_insensitive(client):
    products = [
        {
            "name": "Laptop",
            "price": 1200,
            "stock": 5
        },
        {
            "name": "MOUSE",
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

    response = client.get("/products?search=mouse")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "MOUSE"


def test_get_products_search_no_results(client):
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
        }
    ]

    for product in products:
        response = client.post("/products", json=product)
        assert response.status_code == 201

    response = client.get("/products?search=keyboard")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
    assert data["items"] == []


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

def test_get_products_search_with_pagination(client):
    products = [
        {
            "name": "Laptop",
            "price": 1200,
            "stock": 5
        },
        {
            "name": "Gaming Laptop",
            "price": 1500,
            "stock": 3
        },
        {
            "name": "Laptop Stand",
            "price": 50,
            "stock": 15
        },
        {
            "name": "Mouse",
            "price": 25,
            "stock": 20
        }
    ]

    for product in products:
        response = client.post("/products", json=product)
        assert response.status_code == 201

    response = client.get(
        "/products?search=laptop&skip=1&limit=1"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 3
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "Laptop"

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

def test_get_products_search_with_sorting(client):
    products = [
        {
            "name": "Laptop",
            "price": 1200,
            "stock": 5
        },
        {
            "name": "Gaming Laptop",
            "price": 1500,
            "stock": 3
        },
        {
            "name": "Laptop Stand",
            "price": 50,
            "stock": 15
        },
        {
            "name": "Mouse",
            "price": 25,
            "stock": 20
        }
    ]

    for product in products:
        response = client.post("/products", json=product)
        assert response.status_code == 201

    response = client.get(
        "/products?search=laptop&sort_by=price&order=desc"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 3
    assert len(data["items"]) == 3

    assert data["items"][0]["name"] == "Gaming Laptop"
    assert data["items"][1]["name"] == "Laptop"
    assert data["items"][2]["name"] == "Laptop Stand"

def test_get_products_min_stock(client):
    products = [
        {"name": "Laptop", "price": 1200, "stock": 5},
        {"name": "Mouse", "price": 25, "stock": 20},
        {"name": "Monitor", "price": 300, "stock": 10},
    ]

    for product in products:
        response = client.post("/products", json=product)
        assert response.status_code == 201

    response = client.get("/products?min_stock=10")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 2
    assert len(data["items"]) == 2
    assert data["items"][0]["name"] == "Monitor"
    assert data["items"][1]["name"] == "Mouse"


def test_get_products_max_stock(client):
    products = [
        {"name": "Laptop", "price": 1200, "stock": 5},
        {"name": "Mouse", "price": 25, "stock": 20},
        {"name": "Monitor", "price": 300, "stock": 10},
    ]

    for product in products:
        response = client.post("/products", json=product)
        assert response.status_code == 201

    response = client.get("/products?max_stock=5")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "Laptop"

def test_get_products_invalid_min_stock(client):
    response = client.get("/products?min_stock=-1")

    assert response.status_code == 422


def test_get_products_invalid_max_stock(client):
    response = client.get("/products?max_stock=-1")

    assert response.status_code == 422

def test_get_products_combined_filters(client):
    products = [
        {"name": "Laptop", "price": 1200, "stock": 5},
        {"name": "Gaming Laptop", "price": 1500, "stock": 3},
        {"name": "Laptop Stand", "price": 50, "stock": 15},
        {"name": "Business Laptop", "price": 1800, "stock": 10},
        {"name": "Mouse", "price": 25, "stock": 20},
    ]

    for product in products:
        response = client.post("/products", json=product)
        assert response.status_code == 201

    response = client.get(
        "/products"
        "?search=laptop"
        "&min_stock=5"
        "&sort_by=price"
        "&order=desc"
        "&skip=0"
        "&limit=2"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 3
    assert len(data["items"]) == 2

    assert data["items"][0]["name"] == "Business Laptop"
    assert data["items"][0]["price"] == 1800

    assert data["items"][1]["name"] == "Laptop"
    assert data["items"][1]["price"] == 1200