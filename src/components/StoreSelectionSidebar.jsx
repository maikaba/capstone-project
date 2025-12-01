import React from "react";
import "./StoreSelectionSidebar.css";

export default function StoreSelectionSidebar({ 
  selectedStore, 
  onChangeStore, 
  currentPage,
  onNavigate,
  isOpen, 
}) {
  return (
    <>
      <aside className="sidebar">
        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <button
            className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => onNavigate("dashboard")}
          >
            <span className="icon">📊</span>
            <span className="label">Dashboard</span>
          </button>

          <div className="nav-divider"></div>

          <div className="nav-section">
            <span className="nav-section-title">Stores</span>
            {["Store A", "Store B", "Store C", "Store D"].map((store) => (
              <button
                key={store}
                className={`nav-link store-link ${
                  selectedStore === store && currentPage === "inventory" ? "active" : ""
                }`}
                onClick={() => onChangeStore(store)}
              >
                <span className="icon">🏪</span>
                <span className="label">{store}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
