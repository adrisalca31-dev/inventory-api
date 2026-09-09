import { useEffect, useState } from "react";

import "./App.css";
import ProductTable from "./components/ProductTable";
import { getProducts } from "./services/api";
import type { Product } from "./types/product";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProducts();

      setProducts(data.items);
      setTotal(data.total);
    } catch {
      setError("Unable to load products. Please check the Inventory API.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

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

            <button className="primary-button">+ Add product</button>
          </div>

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

              <button
                className="secondary-button"
                onClick={loadProducts}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh"}
              </button>
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

                <button className="primary-button" onClick={loadProducts}>
                  Try again
                </button>
              </div>
            ) : (
              <ProductTable products={products} />
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;