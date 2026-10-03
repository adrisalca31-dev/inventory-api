import type {
  Product,
  ProductInput,
  ProductListResponse,
} from "../types/product";
import { handleApiResponse } from "./apiError";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export async function getProducts(
  page = 1,
  limit = 10,
  search = ""
): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    skip: String((page - 1) * limit),
    limit: String(limit),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(
    `${API_URL}/products?${params.toString()}`
  );

  return handleApiResponse<ProductListResponse>(
    response,
    "Failed to fetch products"
  );
}

export async function createProduct(
  product: ProductInput
): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  return handleApiResponse<Product>(
    response,
    "Failed to create product"
  );
}

export async function updateProduct(
  productId: number,
  product: ProductInput
): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  return handleApiResponse<Product>(
    response,
    "Failed to update product"
  );
}

export async function deleteProduct(
  productId: number
): Promise<void> {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let message = "Failed to delete product";

    try {
      const data = await response.json();

      if (typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // Keep the fallback message.
    }

    throw new Error(message);
  }
}