import React, { useState } from "react";
import InventoryCharts from "./InventoryCharts";
import "../styles/Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard({ inventory, getStatus, onStoreSelect, onAddProduct, onShowToast }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedStoreForAdd, setSelectedStoreForAdd] = useState("Store A");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    batch: "",
    expiryDate: "",
    temperature: "",
  });

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.quantity || !formData.expiryDate) {
      alert("Please fill in all required fields");
      return;
    }

    const newProduct = {
      id: Date.now() + Math.random() * 10000,
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      batch: formData.batch,
      expiryDate: formData.expiryDate,
      temperature: formData.temperature,
    };

    onAddProduct(selectedStoreForAdd, newProduct);

    // Reset form
    setFormData({
      name: "",
      category: "",
      quantity: "",
      batch: "",
      expiryDate: "",
      temperature: "",
    });
    setIsAddFormOpen(false);
  };

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{payload[0].payload.store}</p>
          <p className="tooltip-value">{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const exportToCSV = () => {
    const allItems = Object.values(inventory).flat();
    
    if (allItems.length === 0) {
      onShowToast("No inventory data to export", "error");
      return;
    }

    const headers = ["Store", "Product Name", "Category", "Quantity", "Batch Number", "Expiry Date", "Storage Temperature", "Status"];
    const rows = allItems.map((item) => [
      item.store || "Unknown",
      item.name,
      item.category,
      item.quantity,
      item.batch,
      item.expiryDate,
      item.temperature || "—",
      getStatus(item).charAt(0).toUpperCase() + getStatus(item).slice(1),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `vaccine-inventory-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onShowToast(`Complete inventory exported successfully (${allItems.length} items)`, "success");
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Vaccine Inventory Dashboard</h1>
        <p>Overview of all vaccine inventory across stores</p>
      </header>

      <InventoryCharts inventory={inventory} getStatus={getStatus} />

      <div className="action-bar">
        <button 
          className="add-product-btn"
          onClick={() => setIsAddFormOpen(true)}
        >
          + Add
        </button>

        <button 
          className="export-btn"
          onClick={exportToCSV}
          title="Export inventory to CSV"
        >
          ⬇ Export
        </button>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search products across all stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isAddFormOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddFormOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="modal-close" onClick={() => setIsAddFormOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Select Store *</label>
                  <select
                    value={selectedStoreForAdd}
                    onChange={(e) => setSelectedStoreForAdd(e.target.value)}
                    className="form-select"
                  >
                    {Object.keys(inventory).map((store) => (
                      <option key={store} value={store}>
                        {store}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  name="name"
                  placeholder="Product Name *"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="form-input"
                />

                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="form-select"
                >
                  <option value="">Select Category *</option>
                  <option value="Viral">Viral</option>
                  <option value="Bacterial">Bacterial</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity *"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  className="form-input"
                />

                <input
                  type="text"
                  name="batch"
                  placeholder="Batch Number"
                  value={formData.batch}
                  onChange={handleFormChange}
                  className="form-input"
                />

                <input
                  type="date"
                  name="expiryDate"
                  placeholder="Expiry Date *"
                  value={formData.expiryDate}
                  onChange={handleFormChange}
                  className="form-input"
                />

                <input
                  type="text"
                  name="temperature"
                  placeholder="Storage Temperature (e.g., 2-8°C)"
                  value={formData.temperature}
                  onChange={handleFormChange}
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
