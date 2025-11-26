import "./InventoryList.css";

export default function InventoryList({ products }) {
  return (
    <div className="card">
      <h2>Inventory List</h2>

      {products.length === 0 ? (
        <p className="muted">No products in this store yet.</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>Temp</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.batch}</td>
                <td>{item.expiryDate}</td>
                <td>{item.temperature || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}