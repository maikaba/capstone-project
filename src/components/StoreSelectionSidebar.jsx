import React from "react";
import "./StoreSelectionSidebar.css";

export default function StoreSelectionSidebar({ 
  selectedStore, 
  onChangeStore, 
  isOpen, 
  onToggle 
}) {
  const stores = [
    { name: "Store A", icon: "🏥" },
    { name: "Store B", icon: "🏢" },
    { name: "Store C", icon: "🏛️" },
    { name: "Store D", icon: "⚕️" },
  ];

  return (
    <>
      <button className="sidebar-toggle" onClick={onToggle} title="Toggle store selector">
        ☰
      </button>

      <aside className={`store-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Stores</h2>
          <button className="close-btn" onClick={onToggle}>✕</button>
        </div>

        <nav className="store-nav">
          {stores.map((store) => (
            <button
              key={store.name}
              className={`store-link ${selectedStore === store.name ? "active" : ""}`}
              onClick={() => onChangeStore(store.name)}
            >
              <span className="store-icon">{store.icon}</span>
              <span className="store-label">{store.name}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
