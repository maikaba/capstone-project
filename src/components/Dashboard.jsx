import React, { useState } from "react";
import InventoryCharts from "./InventoryCharts";
import "../styles/Dashboard.css";

export default function Dashboard({ inventory, getStatus, onStoreSelect, onAddProduct }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedStoreForAdd, setSelectedStoreForAdd] = useState("Store A");

  // Calculate overall statistics
  const allItems = Object.values(inventory).flat();
  const totalProducts = allItems.length;
  const totalQuantity = allItems.reduce((sum, item) => sum + item.quantity, 0);
  const expiredCount = allItems.filter((item) => getStatus(item) === "expired").length;
  const lowStockCount = allItems.filter((item) => getStatus(item) === "low").length;
  const normalCount = allItems.filter((item) => getStatus(item) === "normal").length;

  const storeNames = Object.keys(inventory);
  const storeStats = storeNames.map((store) => ({
    name: store,
    count: inventory[store].length,
    quantity: inventory[store].reduce((sum, item) => sum + item.quantity, 0),
  }));

  // Filter store stats by search query
  const filteredStoreStats = storeStats.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get search results across all stores
  const searchResults = allItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header>
        <h1>Vaccine Inventory Dashboard</h1>
        <p>Overview of all vaccine inventory across stores</p>
      </header>

      {/* Charts instead of Stats */}
      <InventoryCharts inventory={inventory} getStatus={getStatus} />

      {/* Action Bar: Add Button + Search */}
      <div className="action-bar">
        <button 
          className="add-product-btn"
          onClick={() => setIsAddFormOpen(true)}
        >
          + Add Product
        </button>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search products across all stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddFormOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddFormOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="modal-close" onClick={() => setIsAddFormOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsAddFormOpen(false);
              }}>
                <div className="form-group">
                  <label>Select Store *</label>
                  <select
                    value={selectedStoreForAdd}
                    onChange={(e) => setSelectedStoreForAdd(e.target.value)}
                    className="form-select"
                  >
                    {storeNames.map((store) => (
                      <option key={store} value={store}>
                        {store}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Product Name"
                  className="form-input"
                />

                <select className="form-select">
                  <option value="">Select Category</option>
                  <option value="COVID-19">COVID-19</option>
                  <option value="Influenza">Influenza</option>
                  <option value="Measles">Measles</option>
                  <option value="Polio">Polio</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="number"
                  placeholder="Quantity"
                  className="form-input"
                />

                <input
                  type="text"
                  placeholder="Batch Number"
                  className="form-input"
                />

                <input
                  type="date"
                  placeholder="Expiry Date"
                  className="form-input"
                />

                <input
                  type="text"
                  placeholder="Storage Temperature (Optional)"
                  className="form-input"
                />

                <button type="submit" className="btn-submit">
                  Add Product
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Store Breakdown */}
      <section className="card">
        <h2>Store Inventory Breakdown</h2>
        <div className="store-table">
          <div className="table-header">
            <div className="table-cell">Store</div>
            <div className="table-cell">Products</div>
            <div className="table-cell">Total Units</div>
          </div>
          {filteredStoreStats.length > 0 ? (
            filteredStoreStats.map((store) => (
              <div
                key={store.name}
                className="table-row clickable"
                onClick={() => onStoreSelect(store.name)}
                title={`Click to view ${store.name} inventory`}
              >
                <div className="table-cell">{store.name}</div>
                <div className="table-cell">{store.count}</div>
                <div className="table-cell">{store.quantity}</div>
              </div>
            ))
          ) : (
            <div className="table-row empty">
              <div className="table-cell" style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--text-secondary)" }}>
                No stores match your search
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <section className="card">
          <h2>Search Results ({searchResults.length})</h2>
          {searchResults.length > 0 ? (
            <ul className="search-results-list">
              {searchResults.map((item) => (
                <li key={item.id} className={`search-result-item ${getStatus(item)}`}>
                  <div className="result-header">
                    <span className="result-name">{item.name}</span>
                    <span className="result-category">{item.category}</span>
                  </div>
                  <div className="result-details">
                    <span className="result-store">📍 {item.store}</span>
                    <span className="result-qty">{item.quantity} units</span>
                    <span className="result-exp">Exp: {item.expiryDate}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No products match your search.</p>
          )}
        </section>
      )}
    </div>
  );
}
