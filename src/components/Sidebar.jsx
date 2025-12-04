import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ 
  selectedStore, 
  onChangeStore, 
  currentPage,
  onNavigate,
  stores,
  onSidebarStateChange
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const handleStoreClick = (store) => {
    onChangeStore(store);
    setIsOpen(false);
  };

  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onSidebarStateChange) {
      onSidebarStateChange(newState);
    }
  };

  return (
    <>
      {/* Sidebar Toggle Button (Mobile) */}
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
      <aside className={`sidebar ${isOpen ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!isCollapsed && <h2>Menu</h2>}
          <button
            className="sidebar-collapse-btn"
            onClick={handleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Dashboard Link */}
          <button
            className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => handleNavClick("dashboard")}
            title={isCollapsed ? "Dashboard" : ""}
          >
            <span className="icon">⊞</span>
            {!isCollapsed && <span className="label">Dashboard</span>}
          </button>

          {!isCollapsed && <div className="nav-divider"></div>}

          {/* Stores Section */}
          <div className="nav-section">
            {!isCollapsed && <span className="nav-section-title">Stores</span>}
            {stores.map((store) => (
              <button
                key={store}
                className={`nav-link store-link ${
                  selectedStore === store && currentPage === "inventory" ? "active" : ""
                }`}
                onClick={() => handleStoreClick(store)}
                title={isCollapsed ? store : ""}
              >
                <span className="icon">◆</span>
                {!isCollapsed && <span className="label">{store}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="sidebar-footer">
            <small>Vaccine Inventory v1.0</small>
          </div>
        )}
      </aside>
    </>
  );
}
