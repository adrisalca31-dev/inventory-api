interface ProductStatsProps {
  total: number;
  lowStock: number;
  inventoryValue: number;
  isLoading: boolean;
}

function ProductStats({
  total,
  lowStock,
  inventoryValue,
  isLoading,
}: ProductStatsProps) {
  return (
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
          <strong>{isLoading ? "—" : lowStock}</strong>
        </div>
      </article>

      <article className="stat-card">
        <div className="stat-icon">$</div>

        <div>
          <span>Inventory value</span>
          <strong>
            {isLoading ? "—" : `$${inventoryValue.toFixed(2)}`}
          </strong>
        </div>
      </article>
    </div>
  );
}

export default ProductStats;