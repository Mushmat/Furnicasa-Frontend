// src/pages/MyOrders.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const timelineSteps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];

const OrderTimeline = ({ status }) => {
  // If order is cancelled, show a special message
  if (status === "Cancelled") {
    return (
      <div className="mt-2">
        <p className="text-red-600 font-semibold">Order Cancelled</p>
      </div>
    );
  }

  // Find the index of the current status in the timeline; if not found, assume only "Order Placed" is done.
  const currentStepIndex = timelineSteps.indexOf(status) >= 0 ? timelineSteps.indexOf(status) : 0;

  return (
    <div className="mt-4">
      {timelineSteps.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        return (
          <div key={index} className="flex items-center mb-2">
            <div className={`w-4 h-4 rounded-full ${isCompleted ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className="flex-1 ml-2">
              <p className={`${isCompleted ? "text-green-600" : "text-gray-500"} text-sm`}>
                {step}
              </p>
              {index !== timelineSteps.length - 1 && (
                <div className="h-4 border-l-2 ml-1 border-gray-300"></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [cancelError, setCancelError] = useState("");
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Check if order is cancellable: order must be "Pending" and placed today
  const isCancellable = (order) => {
    if (order.status !== "Pending") return false;
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  };

  const cancelOrder = async (orderId) => {
    try {
      // Assuming an endpoint exists for customers to cancel orders:
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/cancel/${orderId}`,
        { status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      setCancelError("Failed to cancel order.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 rounded shadow mb-4">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
            <p>
              <strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <div className="mt-2">
              <p className="font-semibold">Items:</p>
              <ul className="list-disc ml-6">
                {order.items.map((item) => (
                  <li key={item.product?._id}>
                    {item.product ? item.product.title : "Product removed"} - Qty: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <OrderTimeline status={order.status} />

            {isCancellable(order) && (
              <button
                onClick={() => cancelOrder(order._id)}
                className="mt-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Cancel Order
              </button>
            )}
            {cancelError && <p className="text-red-500 mt-2">{cancelError}</p>}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
