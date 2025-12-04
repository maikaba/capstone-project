import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ 
  selectedStore, 
  onChangeStore, 
  currentPage,
  onNavigate,
  stores
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const handleStoreClick = (store) => {
    onChangeStore(store);
    setIsOpen(false);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle sidebar"
        aria-label="Toggle navigation sidebar"
      >
        ≡
      </button>

      {/* Sidebar Overlay (mobile) */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>

        <nav className="sidebar-nav">
          {/* Dashboard Link */}
          <button
            className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => handleNavClick("dashboard")}
          >
            <span className="icon">⊞</span>
            <span className="label">Dashboard</span>
          </button>

          <div className="nav-divider"></div>

          {/* Stores Section */}
          <div className="nav-section">
            <span className="nav-section-title">Stores</span>
            {stores.map((store) => (
              <button
                key={store}
                className={`nav-link store-link ${
                  selectedStore === store && currentPage === "inventory" ? "active" : ""
                }`}
                onClick={() => handleStoreClick(store)}
              >
                <span className="icon">◆</span>
                <span className="label">{store}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <small>Vaccine Inventory v1.0</small>
        </div>
      </aside>
    </>
  );
}
