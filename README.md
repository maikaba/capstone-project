Vaccine Inventory Management Application, Overview

Architecture

This is a React-based single-page application (SPA) for managing vaccine inventory across multiple stores with a dark/light theme toggle.

Key Features

1. Dashboard (Landing Page)
- Recharts Visualizations: Bar chart (inventory by store) and Pie chart (status distribution)
- Action Bar: Add Product button + search across all stores
- Store Breakdown Table: Click any store to view its inventory
- Search Results: Shows matching products.

2. Inventory Management (Store View)
- Select Store: View individual store inventory
- Dashboard Stats: Summary of selected store's items
- Action Bar: Add/search functionality
- CRUD Operations: 
  - Create: Add products via modal form
  - Read: View all products with details
  - Update: Edit products with ✏️ button
  - Delete: Remove products with X button (with confirmation)
  - Export: Export .csv files with the touch of a button.

3. Product Details
Each item displays:
- Name, Category (color-coded badge)
- Quantity, Batch number, Expiry date, Temperature
- Status indicators: 
  - 🟢 Normal (green border)
  - 🟡 Low Stock (yellow warning)
  - 🔴 Expired (red warning)

4. Search & Navigation
- Dashboard Search: Searches products across all stores, shows store location
- Inventory Search: Filters products in selected store
- Home Button (🏠): Navigate to dashboard from anywhere
- Navigation: Clicking store cards jumps to that store's inventory

5. Theme System
- Toggle Button (☀️/🌙): Switch between dark/light modes
- CSS Variables: All colors adapt automatically
- Persistent: Theme preference uses browser storage

Data Flow

```
App.jsx (Main State)
├── currentPage ("dashboard" | "inventory")
├── selectedStore (Store A/B/C/D)
├── inventory (useInventory hook)
│   └── Store → [Products]
└── Forms (add/edit/delete modals)
    ├── FormModal (inventory page)
    └── Dashboard Modal (dashboard add)
```

Tech Stack
- React: UI library
- Recharts: Data visualization
- CSS Variables: Theme system
- useInventory Hook: State management for products
- useTheme Context: Theme management

Responsive Design
- Desktop: Full layout with side-by-side elements
- Tablet/Mobile: Stacked layout, optimized spacing

This creates an efficient, visual-first inventory management system suitable for pharmaceutical/vaccine tracking across multiple locations.
