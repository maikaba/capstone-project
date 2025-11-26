import { useState, useEffect } from "react";

// Sample vaccines
const SAMPLE_VACCINES = [
  { name: "COVID-19 Vaccine", category: "Viral" },
  { name: "Influenza Vaccine", category: "Viral" },
  { name: "Polio Vaccine", category: "Viral" },
  { name: "MMR Vaccine", category: "Viral" },
  { name: "Tetanus Vaccine", category: "Bacterial" },
  { name: "Hepatitis B", category: "Viral" },
  { name: "Varicella Vaccine", category: "Viral" },
  { name: "Yellow Fever", category: "Viral" },
  { name: "Meningococcal", category: "Bacterial" },
  { name: "Pertussis Vaccine", category: "Bacterial" },
];

// Generate initial sample data
const generateInitialData = () => {
  const inventory = {
    "Store A": [],
    "Store B": [],
    "Store C": [],
    "Store D": [],
  };

  const stores = Object.keys(inventory);
  
  stores.forEach((store) => {
    const productCount = Math.floor(Math.random() * 3) + 6;
    
    for (let i = 0; i < productCount; i++) {
      const vaccine = SAMPLE_VACCINES[Math.floor(Math.random() * SAMPLE_VACCINES.length)];
      const today = new Date();
      const daysOffset = Math.floor(Math.random() * 730) - 180;
      const expiryDate = new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000);
      const temperatures = ["2-8°C", "15-25°C", "-20°C or below"];
      
      inventory[store].push({
        id: Date.now() + Math.random() * 10000,
        name: vaccine.name,
        category: vaccine.category,
        quantity: Math.floor(Math.random() * 300) + 20,
        batch: `BATCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        expiryDate: expiryDate.toISOString().split("T")[0],
        temperature: temperatures[Math.floor(Math.random() * temperatures.length)],
      });
    }
  });

  return inventory;
};

export default function useInventory() {
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("vaccine_inventory");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if any store has items
      const hasItems = Object.values(parsed).some(store => store.length > 0);
      if (hasItems) {
        return parsed;
      }
    }
    // Populate with sample data if empty
    return generateInitialData();
  });

  // Save to localStorage on every update
  useEffect(() => {
    localStorage.setItem("vaccine_inventory", JSON.stringify(inventory));
  }, [inventory]);

  // Add product to the correct store
  const addProduct = (store, product) => {
    setInventory((prev) => ({
      ...prev,
      [store]: [product, ...prev[store]],
    }));
  };

  // Delete a product
  const deleteProduct = (store, id) => {
    setInventory((prev) => ({
      ...prev,
      [store]: prev[store].filter((item) => item.id !== id),
    }));
  };

  // Auto-generated status: expired / low stock / normal
  const getStatus = (item) => {
    const today = new Date();
    const expiry = new Date(item.expiryDate);

    if (expiry < today) return "expired";
    if (item.quantity < 50) return "low"; // threshold
    return "normal";
  };

  return {
    inventory,
    setInventory,
    addProduct,
    deleteProduct,
    getStatus,
  };
}