Vaccine Inventory Management Application, Overview

Architecture

This is a React-based single-page application (SPA) for managing vaccine inventory across multiple stores with a dark/light theme toggle and collapsible navigation sidebar.

Key Features

1. Sidebar Navigation
- Fixed Position: Always accessible sidebar on the left
- Collapsible Design: Collapse/expand button (« / ») to toggle between full (260px) and compact (80px) width
- Smooth Transitions: All animations use cubic-bezier easing for a polished feel
- Dashboard Link: Quick navigation to main dashboard
- Store Selection: Direct access to all 4 stores (Store A/B/C/D)
- Section Labels: Organized with "Menu" header and "Stores" section
- Version Footer: Displays app version when expanded
- Responsive: On mobile (≤1024px), becomes an overlay drawer with hamburger toggle
- Content Shifting: Main content automatically adjusts margins when sidebar collapses

2. Dashboard (Landing Page)
- Recharts Visualizations: Bar chart (inventory by store) and Pie chart (status distribution)
- Action Bar: Add Product button + search across all stores
- Store Breakdown Table: Click any store to view its inventory
- Search Results: Shows matching products.

3. Inventory Management (Store View)
- Select Store: View individual store inventory via sidebar
- Dashboard Stats: Summary of selected store's items
- Action Bar: Add/search functionality
- CRUD Operations: 
  - Create: Add products via modal form
  - Read: View all products with details
  - Update: Edit products with ✏️ button
  - Delete: Remove products with X button (with confirmation)
  - Export: Export .csv files with the touch of a button.

4. Product Details
Each item displays:
- Name, Category (color-coded badge)
- Quantity, Batch number, Expiry date, Temperature
- Status indicators: 
  - 🟢 Normal (green border)
  - 🟡 Low Stock (yellow warning)
  - 🔴 Expired (red warning)

5. Search & Navigation
- Dashboard Search: Searches products across all stores, shows store location
- Inventory Search: Filters products in selected store
- Theme Toggle (☀️/🌙): Switch between dark/light modes
- Sidebar Navigation: Quick access to dashboard and all stores
- Store Selection: Click stores in sidebar to jump to inventory

6. Theme System
- Toggle Button (☀️/🌙): Switch between dark/light modes (top-right, fixed position)
- CSS Variables: All colors adapt automatically
- Persistent: Theme preference uses browser storage

Data Flow

```
App.jsx (Main State)
├── currentPage ("dashboard" | "inventory")
├── selectedStore (Store A/B/C/D)
├── sidebarCollapsed (boolean for collapse state)
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
- CSS Transitions: Smooth sidebar animations

Responsive Design
- Desktop: Full sidebar (260px) with content shifting on collapse
- Tablet/Mobile (≤1024px): Collapsible overlay drawer with hamburger menu
- All layouts optimized for readability and usability

This creates an efficient, visual-first inventory management system suitable for pharmaceutical/vaccine tracking across multiple locations with intuitive navigation and flexible layout options.
