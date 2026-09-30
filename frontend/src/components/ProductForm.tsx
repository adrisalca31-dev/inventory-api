import type { Product, ProductInput } from "../types/product";

interface ProductFormProps {
  editingProduct: Product | null;
  formData: ProductInput;
  isSaving: boolean;
  formError: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}

function ProductForm({
  editingProduct,
  formData,
  isSaving,
  formError,
  onChange,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  return (
    <section className="form-card">
      <div className="card-header">
        <div>
          <p className="section-label">Products</p>

          <h3>{editingProduct ? "Edit product" : "Add product"}</h3>

          <p className="form-description">
            {editingProduct
              ? "Update the product information below."
              : "Enter the product information to add it to your inventory."}
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={onCancel}
          disabled={isSaving}
          type="button"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={onSubmit} className="product-form">
        <div className="form-field">
          <label htmlFor="product-name">Product name</label>

          <input
            id="product-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={onChange}
            placeholder="Enter product name"
            maxLength={100}
            disabled={isSaving}
          />

          <span className="field-hint">
            Maximum 100 characters.
          </span>
        </div>

        <div className="form-field">
          <label htmlFor="product-price">Price</label>

          <div className="input-with-prefix">
            <span>$</span>

            <input
              id="product-price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.price}
              onChange={onChange}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="product-stock">Stock</label>

          <input
            id="product-stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={formData.stock}
            onChange={onChange}
            disabled={isSaving}
          />

          <span className="field-hint">
            Stock must be a whole number.
          </span>
        </div>

        {formError && (
          <div className="form-error" role="alert">
            <span>!</span>
            {formError}
          </div>
        )}

        <div className="form-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            className="primary-button"
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : editingProduct
                ? "Save changes"
                : "Create product"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductForm;