// src/pages/MyOrders.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  if (!token) {
    return <p>Please log in to view your orders.</p>;
  }

  if (orders.length === 0) {
    return <p>You have no orders yet.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Price:</strong> {order.totalPrice} ₹</p>
          <ul>
            {order.items.map((item) => (
              <li key={item._id}>
                {item.product.title} - Qty: {item.quantity} - Price: {item.price} ₹
              </li>
            ))}
          </ul>
          <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
