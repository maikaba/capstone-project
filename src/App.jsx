import React, { useState, useEffect } from "react";
import FormModal from "./components/FormModal";
import AddProductForm from "./components/AddProductForm";
import ConfirmDialog from "./components/ConfirmDialog";
import StoreSelectionSidebar from "./components/StoreSelectionSidebar";
import DashboardStats from "./components/DashboardStats";
import useInventory from "./hooks/useInventory";
import { useTheme } from "./context/ThemeContext";
import "./App.css";

export default function App() {
  const { inventory, addProduct, deleteProduct, getStatus } = useInventory();
  const { theme, toggleTheme } = useTheme();
  const [selectedStore, setSelectedStore] = useState("Store A");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1025);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null, itemName: null });
  const [searchQuery, setSearchQuery] = useState("");

  // Handle window resize to adjust sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1025;
      if (isDesktop) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when store is selected (mobile/tablet)
  const handleStoreChange = (store) => {
    setSelectedStore(store);
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Handle delete with confirmation
  const handleDeleteClick = (itemId, itemName) => {
    setDeleteConfirm({ isOpen: true, itemId, itemName });
  };

  const handleConfirmDelete = () => {
    deleteProduct(selectedStore, deleteConfirm.itemId);
    setDeleteConfirm({ isOpen: false, itemId: null, itemName: null });
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
      <StoreSelectionSidebar
        selectedStore={selectedStore}
        onChangeStore={handleStoreChange}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="main-content">
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <header>
          <h1>Vaccine Inventory Management</h1>
          <p>Track vaccines & pharmaceutical products across all stores</p>
        </header>

        {/* Dashboard Stats */}
        <DashboardStats items={filteredItems} getStatus={getStatus} />

        {/* Add Product Button */}
        <button 
          className="add-product-btn"
          onClick={() => setIsFormOpen(true)}
        >
          + Add Product
        </button>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Form Modal */}
        <FormModal 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          selectedStore={selectedStore}
          onAdd={addProduct}
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

                {/* DELETE BUTTON */}
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteClick(item.id, item.name)}
                  title="Delete item"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

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