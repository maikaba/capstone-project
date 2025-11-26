import React from "react";
import "./DashboardStats.css";

export default function DashboardStats({ items, getStatus }) {
  // Calculate metrics
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const expiredCount = items.filter((item) => getStatus(item) === "expired").length;
  const lowStockCount = items.filter((item) => getStatus(item) === "low").length;
  const productCount = items.length;

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-content">
          <span className="stat-label">Total Units</span>
          <span className="stat-value">{totalItems}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💊</div>
        <div className="stat-content">
          <span className="stat-label">Products</span>
          <span className="stat-value">{productCount}</span>
        </div>
      </div>

      <div className={`stat-card ${lowStockCount > 0 ? "warning" : ""}`}>
        <div className="stat-icon">⚠️</div>
        <div className="stat-content">
          <span className="stat-label">Low Stock</span>
          <span className="stat-value">{lowStockCount}</span>
        </div>
      </div>

      <div className={`stat-card ${expiredCount > 0 ? "danger" : ""}`}>
        <div className="stat-icon">⏰</div>
        <div className="stat-content">
          <span className="stat-label">Expired</span>
          <span className="stat-value">{expiredCount}</span>
        </div>
      </div>
    </div>
  );
}
