import React from "react";
import "./StoreSelector.css";

export default function StoreSelector({ selectedStore, onChangeStore }) {
  const stores = [
    { name: "Store A", icon: "🏥" },
    { name: "Store B", icon: "🏢" },
    { name: "Store C", icon: "🏛️" },
    { name: "Store D", icon: "⚕️" },
  ];

  return (
    <div className="store-selector-container">
      <div className="store-selector">
        {stores.map((store) => (
          <button
            key={store.name}
            className={`store-btn ${selectedStore === store.name ? "active" : ""}`}
            onClick={() => onChangeStore(store.name)}
            title={store.name}
          >
            <span className="store-icon">{store.icon}</span>
            <span className="store-name">{store.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}