// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StatCard = ({ label, value }) => (
  <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
    <span className="text-4xl font-bold">{value}</span>
    <span className="mt-1 text-gray-500 uppercase tracking-wide text-sm">{label}</span>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ orders: 0, products: 0, sales: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/overview`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <StatCard label="Orders"   value={stats.orders} />
        <StatCard label="Products" value={stats.products} />
        <StatCard label="Sales ₹"  value={stats.sales.toLocaleString()} />
      </div>

      {/* --- QUICK LINKS --- */}
      <div className="space-y-3">
        <Link to="/admin/orders" className="text-lg text-blue-600 hover:underline">
          • Manage Orders
        </Link>
        <Link to="/admin/add-product" className="text-lg text-blue-600 hover:underline">
          • Add / Edit Products
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
