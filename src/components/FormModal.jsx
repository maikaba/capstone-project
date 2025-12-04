import React, { useState, useEffect } from "react";
import "./FormModal.css";

export default function FormModal({ isOpen, onClose, selectedStore, onAdd, editingItem }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    batch: "",
    expiryDate: "",
    temperature: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        category: editingItem.category || "",
        quantity: editingItem.quantity || "",
        batch: editingItem.batch || "",
        expiryDate: editingItem.expiryDate || "",
        temperature: editingItem.temperature || "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        quantity: "",
        batch: "",
        expiryDate: "",
        temperature: "",
      });
    }
    setError("");
  }, [editingItem, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.category || !formData.quantity || !formData.expiryDate) {
      setError("All fields except temperature are required.");
      return;
    }

    if (editingItem) {
      onAdd(selectedStore, {
        id: editingItem.id,
        store: selectedStore,
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        batch: formData.batch,
        expiryDate: formData.expiryDate,
        temperature: formData.temperature,
      });
    } else {
      onAdd(selectedStore, {
        id: Date.now() + Math.random() * 10000,
        store: selectedStore,
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        batch: formData.batch,
        expiryDate: formData.expiryDate,
        temperature: formData.temperature,
      });
    }

    // Reset form and close modal
    setFormData({
      name: "",
      category: "",
      quantity: "",
      batch: "",
      expiryDate: "",
      temperature: "",
    });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingItem ? "Edit Product" : "Add New Product"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Category</option>
              <option value="Viral">Viral</option>
              <option value="Bacterial">Bacterial</option>
              <option value="Analgesic">Analgesic</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Antidiabetic">Antidiabetic</option>
              <option value="Statin">Statin</option>
              <option value="ACE Inhibitor">ACE Inhibitor</option>
              <option value="Proton Pump Inhibitor">Proton Pump Inhibitor</option>
              <option value="Antihistamine">Antihistamine</option>
              <option value="Vitamin">Vitamin</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="form-input"
            />

            <input
              type="text"
              name="batch"
              placeholder="Batch Number"
              value={formData.batch}
              onChange={handleChange}
              className="form-input"
            />

            <input
              type="date"
              name="expiryDate"
              placeholder="Expiry Date"
              value={formData.expiryDate}
              onChange={handleChange}
              className="form-input"
            />

            <input
              type="text"
              name="temperature"
              placeholder="Storage Temperature (Optional)"
              value={formData.temperature}
              onChange={handleChange}
              className="form-input"
            />

            <button type="submit" className="btn-submit">
              {editingItem ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
