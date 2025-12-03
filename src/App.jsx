import React, { useState } from "react";
import FormModal from "./components/FormModal";
import ConfirmDialog from "./components/ConfirmDialog";
import DashboardStats from "./components/DashboardStats";
import Dashboard from "./components/Dashboard";
import useInventory from "./hooks/useInventory";
import { useTheme } from "./context/ThemeContext";
import "./App.css";

export default function App() {
  const { inventory, addProduct, deleteProduct, getStatus } = useInventory();
  const { theme, toggleTheme } = useTheme();
  const [selectedStore, setSelectedStore] = useState("Store A");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null, itemName: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Handle store change
  const handleStoreChange = (store) => {
    setSelectedStore(store);
    setCurrentPage("inventory");
  };

  // Handle delete with confirmation
  const handleDeleteClick = (itemId, itemName) => {
    setDeleteConfirm({ isOpen: true, itemId, itemName });
  };

  const handleConfirmDelete = () => {
    deleteProduct(selectedStore, deleteConfirm.itemId);
    setDeleteConfirm({ isOpen: false, itemId: null, itemName: null });
  };

  // Handle edit item
  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleEditSave = (store, product) => {
    if (isAddingProduct) return; // Prevent duplicate submissions
    
    setIsAddingProduct(true);
    
    try {
      if (editingItem) {
        deleteProduct(selectedStore, editingItem.id);
        addProduct(store, {
          ...product,
          store: store,
        });
        showToast(`${product.name} updated successfully`, "success");
      } else {
        addProduct(store, {
          ...product,
          store: store,
        });
        showToast(`${product.name} added to ${store}`, "success");
      }
      setEditingItem(null);
      setIsFormOpen(false);
    } finally {
      setIsAddingProduct(false);
    }
  };

  // Load items for selected store
  const filteredItems = inventory[selectedStore] || [];

  // Filter items by search query
  const searchedItems = filteredItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportStoreToCSV = () => {
    const items = inventory[selectedStore];
    
    if (!items || items.length === 0) {
      alert(`No inventory data in ${selectedStore} to export`);
      return;
    }

    const headers = ["Product Name", "Category", "Quantity", "Batch Number", "Expiry Date", "Storage Temperature", "Status"];
    const rows = items.map((item) => [
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
    link.setAttribute("download", `${selectedStore}-inventory-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <div className="main-content">
        <button 
          className="home-btn"
          onClick={() => setCurrentPage("dashboard")}
          title="Go to Dashboard"
        >
          ⌂
        </button>

        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? "◯" : "◐"}
        </button>

        {/* Dashboard Page */}
        {currentPage === "dashboard" && (
          <Dashboard 
            inventory={inventory} 
            getStatus={getStatus}
            onStoreSelect={handleStoreChange}
            onAddProduct={addProduct}
          />
        )}

        {/* Inventory Page */}
        {currentPage === "inventory" && (
          <>
            <header>
              <h1>Vaccine Inventory Management</h1>
              <p>Track vaccines & pharmaceutical products across all stores</p>
            </header>

            {/* Dashboard Stats */}
            <DashboardStats items={filteredItems} getStatus={getStatus} />

            {/* Action Bar: Add Button + Search */}
            <div className="action-bar">
              <button 
                className="add-product-btn"
                onClick={() => setIsFormOpen(true)}
              >
                + Add
              </button>

              <button 
                className="export-btn"
                onClick={exportStoreToCSV}
                title={`Export ${selectedStore} inventory to CSV`}
              >
                ⬇ Export
              </button>

              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Form Modal */}
            <FormModal 
              isOpen={isFormOpen}
              onClose={() => {
                setIsFormOpen(false);
                setEditingItem(null);
              }}
              selectedStore={selectedStore}
              onAdd={handleEditSave}
              editingItem={editingItem}
            />

            {/* Inventory List */}
            <section className="card">
              <h2>{selectedStore} Inventory</h2>

              {filteredItems.length === 0 ? (
                <p className="muted">No products in this store yet.</p>
              ) : searchedItems.length === 0 ? (
                <p className="muted">No products match your search.</p>
              ) : (
                <ul className="inventory-list">
                  {searchedItems.map((item) => (
                    <li key={item.id} className={`inventory-item ${getStatus(item)}`}>
                      <div className="top-row">
                        <span className="name">{item.name}</span>
                        <span className="category">{item.category}</span>
                      </div>

                      <div className="details-row">
                        <span className="qty">{item.quantity} units</span>
                        <span className="batch">Batch: {item.batch}</span>
                        <span className="exp">Exp: {item.expiryDate}</span>
                        {item.temperature && (
                          <span className="temp">Temp: {item.temperature}</span>
                        )}
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="item-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(item)}
                          title="Edit item"
                        >
                          ✎
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteClick(item.id, item.name)}
                          title="Delete item"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteConfirm.itemName}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null, itemName: null })}
          isDangerous={true}
        />
      </div>
    </div>
  );
}