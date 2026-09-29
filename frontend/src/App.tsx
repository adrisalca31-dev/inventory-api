import { useState } from "react";
import useApiStatus from "./hooks/useApiStatus";
import ProductToolbar from "./components/ProductToolbar";
import Pagination from "./components/Pagination";
import useInventoryStats from "./hooks/useInventoryStats";
import "./App.css";
import ProductForm from "./components/ProductForm";
import ProductStats from "./components/ProductStats";
import ProductTable from "./components/ProductTable";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "./services/api";
import useProducts from "./hooks/useProducts";
import type { Product, ProductInput } from "./types/product";

function App() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { isOnline, isChecking } = useApiStatus();

  const {
    products,
    total,
    isLoading,
    isRefreshing,
    error,
    loadProducts,
  } = useProducts(page, limit);

  const totalPages = Math.ceil(total / limit);

  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  );

  const [editingProduct, setEditingProduct] = useState<Product | null>(
    null
  );

  const [formData, setFormData] = useState<ProductInput>({
    name: "",
    price: 0,
    stock: 0,
  });

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(normalizedSearchTerm)
  );

  const searchResultLabel = searchTerm.trim()
    ? `${filteredProducts.length} ${
        filteredProducts.length === 1 ? "product" : "products"
      } found`
    : `${total} products`;

  const firstProduct = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastProduct = Math.min(page * limit, total);

  const { lowStockCount, inventoryValue } =
    useInventoryStats(products);

  function handleFormChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setFormError(null);
    setSuccessMessage(null);

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

  function openCreateForm() {
    setEditingProduct(null);

    setFormData({
      name: "",
      price: 0,
      stock: 0,
    });

    setFormError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
    });

    setFormError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setEditingProduct(null);
    setFormError(null);
  }

  async function handleSaveProduct(event: React.FormEvent) {
    event.preventDefault();

    const validationError = validateProductForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSaving(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: formData.name.trim(),
          price: formData.price,
          stock: formData.stock,
        });

        setSuccessMessage("Product updated successfully.");
      } else {
        await createProduct({
          name: formData.name.trim(),
          price: formData.price,
          stock: formData.stock,
        });

        setSuccessMessage("Product created successfully.");
      }

      setFormData({
        name: "",
        price: 0,
        stock: 0,
      });

      setEditingProduct(null);
      setIsFormOpen(false);

      await loadProducts(true);
    } catch {
      setFormError(
        editingProduct
          ? "Unable to update product. Please try again."
          : "Unable to create product. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setFormError(null);
    setSuccessMessage(null);

    try {
      await deleteProduct(product.id);

      setSuccessMessage("Product deleted successfully.");

      if (products.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await loadProducts(true);
      }
    } catch {
      setFormError("Unable to delete product. Please try again.");
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

          <div className={`status ${isOnline ? "online" : "offline"}`}>
  <span className="status-dot"></span>
  {isChecking
    ? "Checking API..."
    : isOnline
      ? "API Online"
      : "API Offline"}
</div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <p className="section-label">Overview</p>

              <h3>Product inventory</h3>

              <p>
                Manage your products, stock levels and inventory
                information from one place.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={openCreateForm}
            >
              + Add product
            </button>
          </div>

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {isFormOpen && (
            <ProductForm
              editingProduct={editingProduct}
              formData={formData}
              isSaving={isSaving}
              formError={formError}
              onChange={handleFormChange}
              onSubmit={handleSaveProduct}
              onCancel={closeForm}
            />
          )}

          <ProductStats
            total={total}
            lowStock={lowStockCount}
            inventoryValue={inventoryValue}
            isLoading={isLoading}
          />

          <section className="products-card">
            <div className="card-header">
              <div>
                <p className="section-label">Products</p>
                <h3>Product list</h3>
              </div>

              <ProductToolbar
  searchTerm={searchTerm}
  resultLabel={searchResultLabel}
  isLoading={isLoading}
  isRefreshing={isRefreshing}
  onSearchChange={setSearchTerm}
  onRefresh={() => loadProducts(true)}
/>
            </div>

            {isLoading ? (
              <div className="empty-state">
                <div className="loading-spinner"></div>

                <h4>Loading products...</h4>

                <p>
                  We are retrieving the latest inventory information
                  from the API.
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
                {searchTerm.trim() &&
                filteredProducts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">⌕</div>

                    <h4>No products found</h4>

                    <p>
                      No products match your search. Try a different
                      product name.
                    </p>
                  </div>
                ) : (
                  <ProductTable
                    products={filteredProducts}
                    onEdit={openEditForm}
                    onDelete={handleDeleteProduct}
                  />
                )}

             <Pagination
  page={page}
  totalPages={totalPages}
  firstItem={firstProduct}
  lastItem={lastProduct}
  totalItems={total}
  onPrevious={() =>
    setPage((currentPage) => currentPage - 1)
  }
  onNext={() =>
    setPage((currentPage) => currentPage + 1)
  }
/>
              </>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;