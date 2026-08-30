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
            "name": "Test Keyboard",
            "price": 50.00,
            "stock": 10
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Test Keyboard"
    assert data["price"] == 50.00
    assert data["stock"] == 10
    assert "id" in data


def test_get_products(client):
    response = client.get("/products")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_update_product(client):
    create_response = client.post(
        "/products",
        json={
            "name": "Update Test",
            "price": 20.00,
            "stock": 5
        }
    )

    product_id = create_response.json()["id"]

    response = client.put(
        f"/products/{product_id}",
        json={
            "name": "Updated Product",
            "price": 30.00,
            "stock": 8
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == product_id
    assert data["name"] == "Updated Product"
    assert data["price"] == 30.00
    assert data["stock"] == 8


def test_delete_product(client):
    create_response = client.post(
        "/products",
        json={
            "name": "Delete Test",
            "price": 10.00,
            "stock": 3
        }
    )

    product_id = create_response.json()["id"]

    response = client.delete(f"/products/{product_id}")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Product deleted successfully"
    }


def test_get_product(client):
    create_response = client.post(
        "/products",
        json={
            "name": "Get One Test",
            "price": 25.00,
            "stock": 7
        }
    )

    product_id = create_response.json()["id"]

    response = client.get(f"/products/{product_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == product_id
    assert data["name"] == "Get One Test"
    assert data["price"] == 25.00
    assert data["stock"] == 7


def test_get_product_not_found(client):
    response = client.get("/products/999999")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Product not found"
    }

def test_update_product_not_found(client):
    response = client.put(
        "/products/999999",
        json={
            "name": "Nonexistent Product",
            "price": 50.00,
            "stock": 10
        }
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Product not found"
    }


def test_delete_product_not_found(client):
    response = client.delete("/products/999999")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Product not found"
    }