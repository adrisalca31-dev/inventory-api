import type { Product } from "../types/product";

interface InventoryStats {
  lowStockCount: number;
  inventoryValue: number;
}

function useInventoryStats(products: Product[]): InventoryStats {
  const lowStockCount = products.filter(
    (product) => product.stock <= 5
  ).length;

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  return {
    lowStockCount,
    inventoryValue,
  };
}

export default useInventoryStats;