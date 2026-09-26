import { useCallback, useEffect, useState } from "react";

import { getProducts } from "../services/api";
import type { Product } from "../types/product";

interface UseProductsResult {
  products: Product[];
  total: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  loadProducts: (isRefresh?: boolean) => Promise<void>;
}

function useProducts(page: number, limit: number): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(
    async (isRefresh = false) => {
      if (isRefresh || products.length > 0) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const data = await getProducts(page, limit);

        setProducts(data.items);
        setTotal(data.total);
      } catch {
        setError(
          "Unable to load products. Please check the Inventory API."
        );
      } finally {
        if (isRefresh || products.length > 0) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [page, limit, products.length]
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    total,
    isLoading,
    isRefreshing,
    error,
    loadProducts,
  };
}

export default useProducts;