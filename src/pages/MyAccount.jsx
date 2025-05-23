import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

/* timeline helper */

const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];

/* ↳ tweak these two numbers anytime */
const ETA_DAYS = {
  Shipped: 13,            // days after order date
  Delivered: 21,
};

const OrderTimeline = ({ status, placedDate }) => {
  /* Cancelled shortcut */
  if (status === "Cancelled")
    return <p className="text-red-600 font-semibold mt-4">Order Cancelled</p>;

  /* which step is current? (case-insensitive) */
  const current =
    steps.findIndex((s) => s.toLowerCase() === status?.toLowerCase()) || 0;

  /* helper to add N days */
  const addDays = (dateStr, n) =>
    new Date(new Date(dateStr).getTime() + n * 86400000).toLocaleDateString(
      "en-IN",
      { day: "2-digit", month: "short" }
    );

  return (
    <div className="mt-6 flex items-center justify-between gap-2 overflow-x-auto">
      {steps.map((step, i) => {
        const done = i <= current;
        const eta =
          step === "Order Placed"
            ? new Date(placedDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })
            : addDays(placedDate, ETA_DAYS[step] ?? ETA_DAYS.Delivered - 1);

        return (
          <div key={step} className="flex-1 min-w-[70px] text-center">
            <div
              className={`mx-auto w-4 h-4 rounded-full ${
                done ? "bg-green-600" : "bg-gray-300"
              }`}
            />
            <p
              className={`text-xs mt-1 ${
                done ? "text-green-600" : "text-gray-500"
              }`}
            >
              {step}
            </p>
            {step !== "Order Placed" && (
              <p className="text-[11px] text-gray-400">{eta}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* main component */
export default function MyAccount() {
  const { user }            = useAuth();
  const { hash }            = useLocation();
  const [tab, setTab]       = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [fetchErr, setFetchErr] = useState("");
  const token               = localStorage.getItem("token");

  /* hash-based tab switch */
  useEffect(() => {
    const h = hash.replace("#", "");
    if (["dashboard", "orders", "address", "account"].includes(h)) setTab(h);
  }, [hash]);

  /* fetch orders when Orders tab active */
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
      } catch {
        setFetchErr("Could not load orders. Please try again later.");
      }
    })();
  }, [tab, token]);

  return (
    <div id="main-wrapper">
      {/* banner */}
      <section
        className="page-banner-section bg-cover bg-center h-[330px]"
        style={{ backgroundImage: "url('/assets/images/bg/breadcrumb.png')" }}
      >
        <div className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-semibold">My Account</h2>
          <nav className="text-sm mt-2 text-gray-600">
            <ol className="flex space-x-2">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li>/</li><li>My Account</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* layout */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* sidebar */}
        <aside className="lg:w-1/4">
          <nav className="bg-white shadow p-4 flex flex-col space-y-2">
            {[
              ["dashboard", "Dashboard"],
              ["orders",    "Orders"],
              ["address",   "Address"],
              ["account",   "Account Details"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`text-left p-2 rounded ${
                  tab === key ? "bg-orange-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* main content */}
        <main className="flex-1 bg-white shadow p-6">
          {/* Dashboard */}
          {tab === "dashboard" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">Dashboard</h3>
              <p>Hello, <strong>{user?.fullName || user?.email}</strong>!</p>
              <p className="mt-2">
                From here you can view your recent orders, manage addresses and update your details.
              </p>
            </>
          )}

          {/* Orders */}
          {tab === "orders" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">My Orders</h3>
              {fetchErr && <p className="text-red-600">{fetchErr}</p>}
              {!fetchErr && orders.length === 0 && <p>You have no orders yet.</p>}

              {orders.map((order) => (
                <div key={order._id} className="border rounded shadow p-4 mb-6">
                  <div className="flex flex-wrap justify-between">
                    <div>
                      <p><strong>Order&nbsp;ID:</strong> {order._id}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                      <p><strong>Placed&nbsp;on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* item grid */}
                  <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((it) => (
                      <Link
                        key={it._id}
                        to={`/product/${it.product?._id || ""}`}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                      >
                        <img
                          src={it.product?.imageUrl.replace("http://", "https://")}
                          alt={it.product?.title}
                          className="w-16 h-16 object-contain border rounded"
                        />
                        <div className="text-sm">
                          <p className="font-medium">
                            {it.product?.title || "Removed"}
                          </p>
                          <p className="text-gray-500">
                            Qty&nbsp;{it.quantity} • ₹{(it.price * it.quantity).toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

<OrderTimeline status={order.status} placedDate={order.createdAt} />
                </div>
              ))}
            </>
          )}

          {/* Address + Account panes (unchanged) */}
          {tab === "address" && /* ... same as before ... */ null}
          {tab === "account" && /* ... same as before ... */ null}
        </main>
      </div>
    </div>
  );
}
