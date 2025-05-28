// src/pages/AdminOrders.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import clsx from "clsx";

const statusOptions = [
  "Pending",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const badgeColor = (s) =>
  (
    {
      Pending: "bg-yellow-100 text-yellow-800",
      Packed: "bg-indigo-100 text-indigo-800",
      Shipped: "bg-blue-100 text-blue-800",
      "Out for Delivery": "bg-orange-100 text-orange-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    }[s] || "bg-gray-100 text-gray-800"
  );

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  /* ── fetch helpers ─────────────────────────────────────────── */
  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (_id, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${_id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchOrders();
    } catch (err) {
      console.error("Could not update order:", err);
    }
  };

  const deleteOrder = async (_id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${_id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchOrders();
    } catch (err) {
      console.error("Could not delete order:", err);
      alert("Failed to delete order.");
    }
  };

  /* ── UI ─────────────────────────────────────────────────────── */
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders yet.</p>
      ) : (
        orders.map(
          ({
            _id,
            totalPrice,
            status,
            items,
            shippingAddress: sa = {},
          }) => (
            <div key={_id} className="bg-white shadow rounded-lg p-6 mb-6">
              {/* ── header ─────────────────────────────────────── */}
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="font-semibold">
                    Order&nbsp;ID:&nbsp;
                    <span className="font-mono">{_id.slice(-6)}</span>
                  </p>
                  <p>
                    Total:&nbsp;
                    <span className="font-semibold">₹{totalPrice}</span>
                  </p>
                  <p>
                    Status:&nbsp;
                    <span
                      className={clsx(
                        "text-sm px-2 py-0.5 rounded-full",
                        badgeColor(status),
                      )}
                    >
                      {status}
                    </span>
                  </p>
                </div>

                {/* status dropdown */}
                <select
                  value={status}
                  onChange={(e) => updateStatus(_id, e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* delete button */}
                <button
                  onClick={() => deleteOrder(_id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>

              {/* ── ship-to details ───────────────────────────── */}
              {sa.fullName && (
                <div className="mt-4 text-sm leading-relaxed">
                  <p className="font-semibold mb-1">Ship&nbsp;to:</p>
                  <p>
                    {sa.fullName}
                    {sa.phone && ` — ${sa.phone}`}
                  </p>
                  <p>{sa.address}</p>
                  <p>
                    {sa.city}, {sa.state} {sa.postalCode}
                  </p>
                  <p>{sa.country}</p>
                </div>
              )}

              {/* ── items list ───────────────────────────────── */}
              <div className="mt-4 divide-y">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product._id}
                    className="flex items-center py-3 gap-4"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-500">Qty: {quantity}</p>
                    </div>
                    <p className="font-semibold whitespace-nowrap">
                      ₹{(product.price * quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ),
        )
      )}
    </div>
  );
}
