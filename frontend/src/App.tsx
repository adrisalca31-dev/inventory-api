import { useEffect, useState } from "react";

import "./App.css";
import ProductTable from "./components/ProductTable";
import { createProduct, getProducts } from "./services/api";
import type { Product, ProductInput } from "./types/product";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductInput>({
    name: "",
    price: 0,
    stock: 0,
  });

  async function loadProducts(isRefresh = false) {
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
      setError("Unable to load products. Please check the Inventory API.");
    } finally {
      if (isRefresh || products.length > 0) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    loadProducts();
  }, [page]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchResultLabel = searchTerm.trim()
    ? `${filteredProducts.length} ${
        filteredProducts.length === 1 ? "product" : "products"
      } found`
    : `${total} products`;

  const firstProduct = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastProduct = Math.min(page * limit, total);

  function handleFormChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setFormError(null);

    setFormData((currentData) => ({
      ...currentData,
      [name]: name === "name" ? value : Number(value),
    }));
  }

  function validateProductForm(): string | null {
    if (!formData.name.trim()) {
      return "Product name is required.";
    }

    if (formData.price < 0) {
      return "Price cannot be negative.";
    }

    if (formData.stock < 0) {
      return "Stock cannot be negative.";
    }

    return null;
  }

  async function handleCreateProduct(event: React.FormEvent) {
    event.preventDefault();

    const validationError = validateProductForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsCreating(true);
    setFormError(null);
    setError(null);

    try {
      await createProduct({
        name: formData.name.trim(),
        price: formData.price,
        stock: formData.stock,
      });

      setFormData({
        name: "",
        price: 0,
        stock: 0,
      });

      setIsFormOpen(false);

      await loadProducts(true);
    } catch {
      setFormError("Unable to create product. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">I</div>

          <div>
            <h1>Inventory</h1>
            <span>Management</span>
          </div>
        </div>

        <nav className="navigation">
          <a href="#" className="nav-item active">
            <span>▦</span>
            Dashboard
          </a>

          <a href="#" className="nav-item">
            <span>□</span>
            Products
          </a>
        </nav>

        <div className="sidebar-footer">
          <span>Inventory API</span>
          <small>FastAPI + React</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Inventory Management</p>
            <h2>Dashboard</h2>
          </div>

          <div className="status">
            <span className="status-dot"></span>
            API Online
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <p className="section-label">Overview</p>

              <h3>Product inventory</h3>

              <p>
                Manage your products, stock levels and inventory information
                from one place.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => {
                setFormError(null);
                setIsFormOpen(true);
              }}
            >
              + Add product
            </button>
          </div>

          {isFormOpen && (
            <section className="form-card">
              <div className="card-header">
                <div>
                  <p className="section-label">Products</p>
                  <h3>Add product</h3>
                </div>

                <button
                  className="secondary-button"
                  onClick={() => {
                    setFormError(null);
                    setIsFormOpen(false);
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="product-form">
                <label>
                  Product name

                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Product name"
                  />
                </label>

                <label>
                  Price

                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleFormChange}
                  />
                </label>

                <label>
                  Stock

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleFormChange}
                  />
                </label>

                {formError && (
                  <p className="form-error">{formError}</p>
                )}

                <button
                  className="primary-button"
                  type="submit"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create product"}
                </button>
              </form>
            </section>
          )}

          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-icon">▦</div>

              <div>
                <span>Total products</span>
                <strong>{isLoading ? "—" : total}</strong>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-icon">◷</div>

              <div>
                <span>Low stock</span>

                <strong>
                  {isLoading
                    ? "—"
                    : products.filter((product) => product.stock <= 5).length}
                </strong>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-icon">$</div>

              <div>
                <span>Inventory value</span>

                <strong>
                  {isLoading
                    ? "—"
                    : `$${products
                        .reduce(
                          (total, product) =>
                            total + product.price * product.stock,
                          0
                        )
                        .toFixed(2)}`}
                </strong>
              </div>
            </article>
          </div>

          <section className="products-card">
            <div className="card-header">
              <div>
                <p className="section-label">Products</p>
                <h3>Product list</h3>
              </div>

              <div className="product-actions">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />

                <span className="search-result-count">
                  {searchResultLabel}
                </span>

                <button
                  className="secondary-button"
                  onClick={() => loadProducts(true)}
                  disabled={isLoading || isRefreshing}
                >
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="empty-state">
                <div className="loading-spinner"></div>

                <h4>Loading products...</h4>

                <p>
                  We are retrieving the latest inventory information from the
                  API.
                </p>
              </div>
            ) : error ? (
              <div className="empty-state error-state">
                <div className="empty-icon">!</div>

                <h4>Unable to load products</h4>

                <p>{error}</p>

                <button
                  className="primary-button"
                  onClick={() => loadProducts(true)}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? "Refreshing..." : "Try again"}
                </button>
              </div>
            ) : (
              <>
                <ProductTable products={filteredProducts} />

                <div className="pagination">
                  <span>
                    Showing {firstProduct}–{lastProduct} of {total} products
                  </span>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      setPage((currentPage) => currentPage - 1)
                    }
                    disabled={page === 1}
                  >
                    Previous
                  </button>

                  <span>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      setPage((currentPage) => currentPage + 1)
                    }
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;