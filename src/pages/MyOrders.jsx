// src/pages/MyAccount.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const timelineSteps = [
  "Order Placed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const OrderTimeline = ({ status }) => {
  if (status === "Cancelled") {
    return (
      <div className="mt-2">
        <p className="text-red-600 font-semibold">Order Cancelled</p>
      </div>
    );
  }

  const currentStepIndex =
    timelineSteps.indexOf(status) >= 0
      ? timelineSteps.indexOf(status)
      : 0;

  return (
    <div className="mt-4">
      {timelineSteps.map((step, idx) => {
        const done = idx <= currentStepIndex;
        return (
          <div key={step} className="flex items-center mb-2">
            <div
              className={`w-4 h-4 rounded-full ${
                done ? "bg-green-600" : "bg-gray-300"
              }`}
            />
            <div className="flex-1 ml-2">
              <p
                className={`${
                  done ? "text-green-600" : "text-gray-500"
                } text-sm`}
              >
                {step}
              </p>
              {idx < timelineSteps.length - 1 && (
                <div className="h-4 border-l-2 ml-1 border-gray-300" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MyAccount = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [cancelError, setCancelError] = useState("");

  const token = localStorage.getItem("token");

  // fetch only when Orders tab is active
  useEffect(() => {
    if (tab === "orders") {
      (async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOrders(res.data);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        }
      })();
    }
  }, [tab, token]);

  const isCancellable = (order) => {
    if (order.status !== "Pending") return false;
    const placed = new Date(order.createdAt).toDateString();
    return placed === new Date().toDateString();
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/cancel/${orderId}`,
        { status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // refresh
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Cancel failed:", err);
      setCancelError("Could not cancel. Please try again.");
    }
  };

  return (
    <div id="main-wrapper">
      {/* Banner */}
      <section
        className="page-banner-section bg-gray-200"
        style={{
          backgroundImage: "url('/assets/images/bg/breadcrumb.png')",
        }}
      >
        <div className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-semibold">My Account</h2>
          <nav className="text-sm mt-2 text-gray-600">
            <ol className="flex space-x-2">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>/</li>
              <li>My Account</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4">
          <nav className="bg-white shadow p-4 flex flex-col space-y-2">
            {[
              { key: "dashboard", label: "Dashboard" },
              { key: "orders", label: "Orders" },
              { key: "address", label: "Address" },
              { key: "account", label: "Account Details" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`text-left p-2 rounded ${
                  tab === key
                    ? "bg-orange-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}

            <button
              onClick={logout}
              className="text-left p-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 bg-white shadow p-6">
          {tab === "dashboard" && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Dashboard</h3>
              <p className="mb-4">
                Hello, <strong>{user?.fullName || user?.email}</strong>!
                <button
                  onClick={logout}
                  className="text-orange-600 hover:underline ml-2"
                >
                  Logout
                </button>
              </p>
              <p>
                From your dashboard you can view your recent orders, manage
                addresses, and update your account details.
              </p>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">My Orders</h3>
              {orders.length === 0 ? (
                <p>You have no orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="border p-4 rounded shadow mb-6"
                  >
                    <p>
                      <strong>Order ID:</strong> {order._id}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{order.totalPrice}
                    </p>
                    <p>
                      <strong>Placed on:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <div className="mt-2">
                      <p className="font-semibold">Items:</p>
                      <ul className="list-disc ml-6">
                        {order.items.map((itm) => (
                          <li key={itm._id}>
                            {itm.product?.title || "Removed"} × {itm.quantity}
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
                    {cancelError && (
                      <p className="text-red-500 mt-2">{cancelError}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "address" && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Billing Address</h3>
              <address className="not-italic">
                <p>
                  <strong>{user?.fullName || user?.email}</strong>
                </p>
                <p>123 Main St, Suite 400</p>
                <p>Some City, ST 12345</p>
                <p>Mobile: +1 234 567 8900</p>
              </address>
              <button className="mt-4 px-4 py-2 bg-orange-600 text-white rounded">
                Edit Address
              </button>
            </div>
          )}

          {tab === "account" && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Account Details
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border px-3 py-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="border px-3 py-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Display Name"
                    className="border px-3 py-2 rounded w-full md:col-span-2"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="border px-3 py-2 rounded w-full md:col-span-2"
                  />
                </div>

                <h4 className="font-semibold mt-4">Password change</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="border px-3 py-2 rounded w-full"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="border px-3 py-2 rounded w-full"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-orange-600 text-white rounded"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyAccount;
