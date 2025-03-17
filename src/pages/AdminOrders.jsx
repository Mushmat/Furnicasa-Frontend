// src/pages/AdminOrders.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Order updated:", res.data);
      fetchOrders(); // Refresh the orders after update
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Orders Management</h2>
      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded mb-4">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.product._id}>
                {item.product.title} - Qty: {item.quantity}
              </li>
            ))}
          </ul>
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
            className="border rounded p-2 mt-2"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
