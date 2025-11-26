import React from "react";
import AddProductForm from "./AddProductForm";
import "./FormModal.css";

export default function FormModal({ isOpen, onClose, selectedStore, onAdd }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Product to Inventory</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <AddProductForm 
            selectedStore={selectedStore}
            onAdd={(store, product) => {
              onAdd(store, product);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
