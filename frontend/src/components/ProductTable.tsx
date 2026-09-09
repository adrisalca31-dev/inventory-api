import type { Product } from "../types/product";

interface ProductTableProps {
  products: Product[];
}

function ProductTable({ products }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">▦</div>
        <h4>No products yet</h4>
        <p>
          Your products will appear here once they are loaded from the
          Inventory API.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-name">
                  <span className="product-avatar">
                    {product.name.charAt(0).toUpperCase()}
                  </span>

                  <div>
                    <strong>{product.name}</strong>
                    <small>Product #{product.id}</small>
                  </div>
                </div>
              </td>

              <td>${product.price.toFixed(2)}</td>

              <td>{product.stock}</td>

              <td>
                <span
                  className={
                    product.stock === 0
                      ? "stock-badge out"
                      : product.stock <= 5
                        ? "stock-badge low"
                        : "stock-badge available"
                  }
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : product.stock <= 5
                      ? "Low stock"
                      : "In stock"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;