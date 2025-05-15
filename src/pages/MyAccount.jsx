// src/pages/MyAccount.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

/* ────────────────────────────────────────────────────────── */
/*  tiny timeline helper                                      */
/* ────────────────────────────────────────────────────────── */
const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];

const OrderTimeline = ({ status }) => {
  if (status === "Cancelled") {
    return <p className="text-red-600 font-semibold mt-2">Order Cancelled</p>;
  }

  const current = steps.indexOf(status); // -1 if server sent an odd status
  return (
    <div className="mt-4 space-y-2">
      {steps.map((step, i) => {
        const done = i <= current;
        return (
          <div key={step} className="flex items-center">
            <span
              className={`w-3 h-3 rounded-full ${
                done ? "bg-green-600" : "bg-gray-300"
              }`}
            />
            <span
              className={`ml-2 text-sm ${
                done ? "text-green-600" : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ────────────────────────────────────────────────────────── */
/*  main component                                            */
/* ────────────────────────────────────────────────────────── */
const MyAccount = () => {
  const { user } = useAuth(); // logout lives in Navbar only
  const [tab, setTab]       = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [fetchErr, setFetchErr] = useState("");
  const token = localStorage.getItem("token");

  /* fetch orders whenever Orders-tab is active */
  useEffect(() => {
    if (tab !== "orders") return;
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data);
        setFetchErr("");
      } catch (err) {
        console.error(err);
        setFetchErr("Could not load orders. Please try again later.");
      }
    })();
  }, [tab, token]);

  /* ───────────── render ───────────── */
  return (
    <div id="main-wrapper">
      {/* page banner */}
      <section
        className="page-banner-section bg-cover bg-center h-[330px]"
        style={{ backgroundImage: "url('/assets/images/bg/breadcrumb.png')" }}
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

      {/* content */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* sidebar */}
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
          </nav>
        </aside>

        {/* main panel */}
        <main className="flex-1 bg-white shadow p-6">
          {/* DASHBOARD -------------------------------------------------- */}
          {tab === "dashboard" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">Dashboard</h3>
              <p>
                Hello, <strong>{user?.fullName || user?.email}</strong>!
              </p>
              <p className="mt-2">
                From here you can view recent orders, manage addresses &
                update your account details.
              </p>
            </>
          )}

          {/* ORDERS ----------------------------------------------------- */}
          {tab === "orders" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">My Orders</h3>
              {fetchErr && <p className="text-red-600">{fetchErr}</p>}
              {orders.length === 0 && !fetchErr && (
                <p>You have no orders yet.</p>
              )}
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded shadow p-4 mb-6"
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
                      {order.items.map((it) => (
                        <li key={it._id}>
                          {it.product?.title || "Removed"} × {it.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <OrderTimeline status={order.status} />
                </div>
              ))}
            </>
          )}

          {/* ADDRESS ---------------------------------------------------- */}
          {tab === "address" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">Billing Address</h3>
              <address className="not-italic leading-6">
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
            </>
          )}

          {/* ACCOUNT DETAILS ------------------------------------------- */}
          {tab === "account" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">
                Account Details
              </h3>
              {/* (static form placeholders) */}
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyAccount;
