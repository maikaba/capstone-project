import React, { useState } from "react";
import "./AddProductForm.css";

export default function AddProductForm({ selectedStore, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    batch: "",
    expiryDate: "",
    temperature: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.category ||
      !formData.quantity ||
      !formData.batch ||
      !formData.expiryDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      store: selectedStore,
      ...formData,
      quantity: Number(formData.quantity),
    };

    // Send product to inventory hook
    onAdd(selectedStore, newProduct);

    // Reset form
    setFormData({
      name: "",
      category: "",
      quantity: "",
      batch: "",
      expiryDate: "",
      temperature: "",
    });
    setError("");
  };

  return (
    <div className="card">
      <h2>Add New Product</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="Product Name *"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Category (Vaccine, Drug...) *"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="quantity"
            placeholder="Quantity *"
            value={formData.quantity}
            onChange={handleChange}
          />

          <input
            type="text"
            name="batch"
            placeholder="Batch Number *"
            value={formData.batch}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
          />

          <input
            type="text"
            name="temperature"
            placeholder="Storage Temp (e.g., 2-8°C)"
            value={formData.temperature}
            onChange={handleChange}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn-submit" type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
}