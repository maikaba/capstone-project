import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/InventoryCharts.css";

export default function InventoryCharts({ inventory, getStatus }) {
  // Data for bar chart - inventory by store
  const storeNames = Object.keys(inventory);
  const barChartData = storeNames.map((store) => ({
    store,
    products: inventory[store].length,
    quantity: inventory[store].reduce((sum, item) => sum + item.quantity, 0),
  }));

  // Data for pie chart - status distribution
  const allItems = Object.values(inventory).flat();
  const expiredCount = allItems.filter((item) => getStatus(item) === "expired").length;
  const lowStockCount = allItems.filter((item) => getStatus(item) === "low").length;
  const normalCount = allItems.filter((item) => getStatus(item) === "normal").length;

  const pieChartData = [
    { name: "Expired", value: expiredCount, fill: "#f87171" },
    { name: "Low Stock", value: lowStockCount, fill: "#fbbf24" },
    { name: "Normal", value: normalCount, fill: "#4ade80" },
  ].filter((item) => item.value > 0);

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{payload[0].name}</p>
          <p className="tooltip-value">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-grid">
      {/* Bar Chart */}
      <div className="chart-card">
        <h3>Inventory by Store</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="store" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip content={customTooltip} />
            <Legend />
            <Bar dataKey="products" fill="#3b82f6" name="Products" radius={[8, 8, 0, 0]} />
            <Bar dataKey="quantity" fill="#fbbf24" name="Units" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="chart-card">
        <h3>Inventory Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
