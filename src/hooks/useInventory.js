import { useState, useEffect } from "react";

// Vaccine products for Store A & B
const VACCINES = [
  { name: "COVID-19 Vaccine (Pfizer)", category: "Viral", quantity: 145, batch: "BATCH-C19P001", expiryDate: "2025-06-15", temperature: "2-8°C" },
  { name: "COVID-19 Vaccine (Moderna)", category: "Viral", quantity: 98, batch: "BATCH-C19M002", expiryDate: "2025-08-20", temperature: "2-8°C" },
  { name: "Influenza Vaccine (Seasonal)", category: "Viral", quantity: 312, batch: "BATCH-FLU001", expiryDate: "2025-12-31", temperature: "2-8°C" },
  { name: "Polio Vaccine (IPV)", category: "Viral", quantity: 67, batch: "BATCH-POLIO01", expiryDate: "2025-10-10", temperature: "2-8°C" },
  { name: "MMR Vaccine", category: "Viral", quantity: 156, batch: "BATCH-MMR001", expiryDate: "2025-09-05", temperature: "-20°C or below" },
  { name: "Tetanus Vaccine", category: "Bacterial", quantity: 234, batch: "BATCH-TET001", expiryDate: "2025-07-22", temperature: "2-8°C" },
  { name: "Hepatitis B Vaccine", category: "Viral", quantity: 189, batch: "BATCH-HEP001", expiryDate: "2025-11-30", temperature: "2-8°C" },
  { name: "Varicella Vaccine", category: "Viral", quantity: 42, batch: "BATCH-VAR001", expiryDate: "2025-05-18", temperature: "-20°C or below" },
  { name: "Yellow Fever Vaccine", category: "Viral", quantity: 28, batch: "BATCH-YF001", expiryDate: "2025-04-12", temperature: "2-8°C" },
  { name: "Meningococcal Vaccine", category: "Bacterial", quantity: 76, batch: "BATCH-MEN001", expiryDate: "2025-08-08", temperature: "2-8°C" },
];

// Pharmaceutical products for Store C & D
const PHARMACEUTICALS = [
  { name: "Ibuprofen 400mg Tablets", category: "Analgesic", quantity: 500, batch: "BATCH-IBU001", expiryDate: "2026-03-15", temperature: "15-25°C" },
  { name: "Amoxicillin 500mg Capsules", category: "Antibiotic", quantity: 320, batch: "BATCH-AMX001", expiryDate: "2025-09-20", temperature: "15-25°C" },
  { name: "Metformin 500mg Tablets", category: "Antidiabetic", quantity: 450, batch: "BATCH-MET001", expiryDate: "2026-01-10", temperature: "15-25°C" },
  { name: "Atorvastatin 20mg Tablets", category: "Statin", quantity: 280, batch: "BATCH-ATO001", expiryDate: "2025-11-28", temperature: "15-25°C" },
  { name: "Lisinopril 10mg Tablets", category: "ACE Inhibitor", quantity: 195, batch: "BATCH-LIS001", expiryDate: "2025-07-05", temperature: "15-25°C" },
  { name: "Omeprazole 20mg Capsules", category: "Proton Pump Inhibitor", quantity: 380, batch: "BATCH-OMP001", expiryDate: "2026-02-14", temperature: "15-25°C" },
  { name: "Cetirizine 10mg Tablets", category: "Antihistamine", quantity: 620, batch: "BATCH-CET001", expiryDate: "2026-05-22", temperature: "15-25°C" },
  { name: "Loratadine 10mg Tablets", category: "Antihistamine", quantity: 440, batch: "BATCH-LOR001", expiryDate: "2026-04-18", temperature: "15-25°C" },
  { name: "Vitamin C 1000mg Tablets", category: "Vitamin", quantity: 800, batch: "BATCH-VIT001", expiryDate: "2026-08-30", temperature: "15-25°C" },
  { name: "Vitamin D3 1000IU Tablets", category: "Vitamin", quantity: 550, batch: "BATCH-VID001", expiryDate: "2026-06-12", temperature: "15-25°C" },
];

// Generate initial data
const generateInitialData = () => {
  return {
    "Store A": VACCINES.slice(0, 5).map((item, idx) => ({
      ...item,
      id: Date.now() + idx,
      store: "Store A",
    })),
    "Store B": VACCINES.slice(5, 10).map((item, idx) => ({
      ...item,
      id: Date.now() + 100 + idx,
      store: "Store B",
    })),
    "Store C": PHARMACEUTICALS.slice(0, 5).map((item, idx) => ({
      ...item,
      id: Date.now() + 200 + idx,
      store: "Store C",
    })),
    "Store D": PHARMACEUTICALS.slice(5, 10).map((item, idx) => ({
      ...item,
      id: Date.now() + 300 + idx,
      store: "Store D",
    })),
  };
};

export default function useInventory() {
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("vaccine_inventory");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if any store has items
      const hasItems = Object.values(parsed).some(store => store.length > 0);
      if (hasItems) {
        // Ensure all items have store property set
        return Object.entries(parsed).reduce((acc, [storeName, items]) => {
          acc[storeName] = items.map(item => ({
            ...item,
            store: item.store || storeName,
          }));
          return acc;
        }, {});
      }
    }
    // Initialize with predefined data
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
      [store]: [
        {
          ...product,
          id: product.id || Date.now() + Math.random() * 10000,
          store: store,
        },
        ...prev[store],
      ],
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
    if (item.quantity < 50) return "low";
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