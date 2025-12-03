import React, { useState, useEffect } from "react";
import "./InventoryFilter.css";

export default function InventoryFilter({ 
  items, 
  onFilter, 
  getStatus 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["all", ...new Set(items.map(item => item.category))];

  // Reset filters when items change (store changes)
  useEffect(() => {
    handleReset();
  }, [items.length]);

  const applyFilters = (query, status, category, sort) => {
    let filtered = items;

    if (query) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.batch.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter(item => getStatus(item) === status);
    }

    if (category !== "all") {
      filtered = filtered.filter(item => item.category === category);
    }

    filtered.sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "quantity":
          return b.quantity - a.quantity;
        case "expiry":
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        case "status":
          const statusOrder = { expired: 0, low: 1, normal: 2 };
          return statusOrder[getStatus(a)] - statusOrder[getStatus(b)];
        default:
          return 0;
      }
    });

    onFilter(filtered);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    applyFilters(e.target.value, statusFilter, categoryFilter, sortBy);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    applyFilters(searchQuery, e.target.value, categoryFilter, sortBy);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    applyFilters(searchQuery, statusFilter, e.target.value, sortBy);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    applyFilters(searchQuery, statusFilter, categoryFilter, e.target.value);
  };

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortBy("name");
    applyFilters("", "all", "all", "name");
  };

  // ...existing return code...
}
