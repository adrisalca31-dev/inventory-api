interface ProductToolbarProps {
  searchTerm: string;
  resultLabel: string;
  isLoading: boolean;
  isRefreshing: boolean;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

function ProductToolbar({
  searchTerm,
  resultLabel,
  isLoading,
  isRefreshing,
  onSearchChange,
  onRefresh,
}: ProductToolbarProps) {
  return (
    <div className="product-actions">
      <div className="search-field">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search products"
        />

        {searchTerm && (
          <button
            type="button"
            className="clear-search"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <span className="search-result-count">
        {resultLabel}
      </span>

      <button
        type="button"
        className="secondary-button refresh-button"
        onClick={onRefresh}
        disabled={isLoading || isRefreshing}
      >
        <span className="refresh-icon">↻</span>

        {isRefreshing ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}

export default ProductToolbar;