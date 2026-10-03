
interface PaginationProps {
  page: number;
  totalPages: number;
  firstItem: number;
  lastItem: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
}

function Pagination({
  page,
  totalPages,
  firstItem,
  lastItem,
  totalItems,
  onPrevious,
  onNext,
}: PaginationProps) {
  const hasProducts = totalItems > 0;

  return (
    <div className="pagination">
      <span className="pagination-summary">
        Showing {firstItem}–{lastItem} of {totalItems} products
      </span>

      <div className="pagination-controls">
        <button
          type="button"
          className="secondary-button"
          onClick={onPrevious}
          disabled={page <= 1 || !hasProducts}
        >
          Previous
        </button>

        <span className="pagination-page">
          Page {totalPages > 0 ? page : 0} of {totalPages}
        </span>

        <button
          type="button"
          className="secondary-button"
          onClick={onNext}
          disabled={page >= totalPages || !hasProducts}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
