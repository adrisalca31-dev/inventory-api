import type { Product } from "../types/product";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function ProductTable({
  products,
  isLoading,
  error,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="table-state">
        <div className="state-icon loading-icon">↻</div>
        <h3>Loading products</h3>
        <p>We're getting the latest inventory information.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-state table-state-error">
        <div className="state-icon error-icon">!</div>
        <h3>Unable to load products</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="table-state">
        <div className="state-icon empty-icon">▦</div>
        <h3>No products found</h3>
        <p>
          There are no products to display with the current search.
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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <strong>{product.name}</strong>
              </td>

              <td>${product.price.toFixed(2)}</td>

              <td>{product.stock}</td>

              <td>
                <span
                  className={
                    product.stock <= 5
                      ? "stock-badge low"
                      : "stock-badge"
                  }
                >
                  {product.stock <= 5 ? "Low stock" : "In stock"}
                </span>
              </td>

              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="table-action-button edit-action"
                    onClick={() => onEdit(product)}
                    aria-label={`Edit ${product.name}`}
                  >
                    <span className="action-icon">✎</span>
                    Edit
                  </button>

                  <button
                    type="button"
                    className="table-action-button delete-action"
                    onClick={() => onDelete(product)}
                    aria-label={`Delete ${product.name}`}
                  >
                    <span className="action-icon">×</span>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;