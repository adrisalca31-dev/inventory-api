export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
}

export interface ProductInput {
  name: string;
  price: number;
  stock: number;
}