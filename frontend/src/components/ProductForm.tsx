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
        <label>
          Product name

          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={onChange}
            placeholder="Enter product name"
            maxLength={100}
            disabled={isSaving}
          />
        </label>

        <label>
          Price

          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={onChange}
            disabled={isSaving}
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
            onChange={onChange}
            disabled={isSaving}
          />
        </label>

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

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
      </form>
    </section>
  );
}

export default ProductForm;