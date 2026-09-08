import "./App.css";

function App() {
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
                <strong>0</strong>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-icon">◷</div>
              <div>
                <span>Low stock</span>
                <strong>0</strong>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-icon">$</div>
              <div>
                <span>Inventory value</span>
                <strong>$0.00</strong>
              </div>
            </article>
          </div>

          <section className="products-card">
            <div className="card-header">
              <div>
                <p className="section-label">Products</p>
                <h3>Product list</h3>
              </div>

              <button className="secondary-button">Refresh</button>
            </div>

            <div className="empty-state">
              <div className="empty-icon">▦</div>
              <h4>No products yet</h4>
              <p>
                Your products will appear here once they are loaded from the
                Inventory API.
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;