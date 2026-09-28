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
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <span className="search-result-count">{resultLabel}</span>

      <button
        className="secondary-button"
        onClick={onRefresh}
        disabled={isLoading || isRefreshing}
      >
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}

export default ProductToolbar;