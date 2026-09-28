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
  return (
    <div className="pagination">
      <span>
        Showing {firstItem}–{lastItem} of {totalItems} products
      </span>

      <button
        className="secondary-button"
        onClick={onPrevious}
        disabled={page === 1}
      >
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        className="secondary-button"
        onClick={onNext}
        disabled={page === totalPages || totalPages === 0}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;