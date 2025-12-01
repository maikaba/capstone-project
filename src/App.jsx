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

  const handleEditSave = (updatedData) => {
    if (editingItem) {
      // For edit mode - pass the full updated item
      deleteProduct(selectedStore, editingItem.id);
      addProduct(selectedStore, updatedData);
    } else {
      // For add mode - updatedData is (store, itemData)
      addProduct(updatedData, arguments[1] || {});
    }
    setEditingItem(null);
    setIsFormOpen(false);
  };

  // Load items for selected store
  const filteredItems = inventory[selectedStore] || [];

  // Filter items by search query
  const searchedItems = filteredItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <div className="main-content">
        <button 
          className="home-btn"
          onClick={() => setCurrentPage("dashboard")}
          title="Go to Dashboard"
        >
          🏠
        </button>

        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
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
                + Add Product
              </button>

              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="🔍 Search by name or category..."
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
                          ✏️
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteClick(item.id, item.name)}
                          title="Delete item"
                        >
                          🗑️
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