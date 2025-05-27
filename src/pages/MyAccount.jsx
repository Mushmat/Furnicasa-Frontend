import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import OrderTimeline from "../components/OrderTimeline"; // adjust import path

const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
const ETA_DAYS = { Shipped: 13, Delivered: 21 };

export default function MyAccount() {
  const { user: authUser } = useAuth();
  const { hash }           = useLocation();
  const token              = localStorage.getItem("token");
  const [tab, setTab]      = useState("dashboard");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: { street: "", city: "", state: "", postalCode: "", country: "" },
  });
  const [orders, setOrders]   = useState([]);
  const [fetchErr, setFetchErr] = useState("");
  const [savingMsg, setSavingMsg] = useState("");

  // switch tabs by hash
  useEffect(() => {
    const h = hash.replace("#", "");
    if (["dashboard","orders","address","account"].includes(h)) setTab(h);
  }, [hash]);

  // fetch profile on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(data);
      } catch (err) {
        console.error("Could not load profile", err);
      }
    })();
  }, [token]);

  // fetch orders when tab=orders
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

  // handle account details save
  const saveAccount = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
        {
          fullName: profile.fullName,
          phone: profile.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(data);
      setSavingMsg("Account details updated");
      setTimeout(() => setSavingMsg(""), 3000);
    } catch {
      setSavingMsg("Failed to save account details");
      setTimeout(() => setSavingMsg(""), 3000);
    }
  };

  // handle address save
  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
        { address: profile.address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(data);
      setSavingMsg("Address updated");
      setTimeout(() => setSavingMsg(""), 3000);
    } catch {
      setSavingMsg("Failed to save address");
      setTimeout(() => setSavingMsg(""), 3000);
    }
  };

  return (
    <div id="main-wrapper">
      {/* banner */}
      <section
        className="page-banner-section relative bg-cover bg-center h-[330px]"
        style={{ backgroundImage: "url('/assets/images/bg/breadcrumb.png')" }}
      >
        {/* dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="container relative z-20 mx-auto py-12 px-4 text-white">
          <h2 className="text-3xl font-semibold drop-shadow-lg">My Account</h2>
          <nav className="text-sm mt-2 opacity-90">
            <ol className="flex space-x-2">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>My Account</li>
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
              ["dashboard",    "Dashboard"],
              ["orders",       "Orders"],
              ["address",      "Address"],
              ["account",      "Account Details"],
            ].map(([key,label])=>(
              <button
                key={key}
                onClick={()=>setTab(key)}
                className={`text-left p-2 rounded ${
                  tab===key
                    ? "bg-orange-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
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
              <p>
                Hello, <strong>{profile.fullName || profile.email}</strong>!
              </p>
              <p className="mt-2">
                From here you can view your recent orders, manage your address and update your account details.
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
                      <p><strong>Order ID:</strong> {order._id}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                      <p>
                        <strong>Placed on:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((it) => (
                      <Link
                        key={it._id}
                        to={`/product/${it.product?._id || ""}`}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                      >
                        <img
                          src={it.product?.imageUrl.replace("http://","https://")}
                          alt={it.product?.title}
                          className="w-16 h-16 object-contain border rounded"
                        />
                        <div className="text-sm">
                          <p className="font-medium">
                            {it.product?.title || "Removed"}
                          </p>
                          <p className="text-gray-500">
                            Qty {it.quantity} • ₹
                            {(it.price * it.quantity).toLocaleString()}
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

          {/* Address */}
          {tab === "address" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">Your Address</h3>
              <form onSubmit={saveAddress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["street","city","state","postalCode","country"].map((field) => (
                    <div key={field}>
                      <label className="block font-medium capitalize">
                        {field.replace(/([A-Z])/g," $1")}
                      </label>
                      <input
                        name={field}
                        value={profile.address[field] || ""}
                        onChange={(e)=>{
                          const v = e.target.value;
                          setProfile(p=>({
                            ...p,
                            address:{ ...p.address, [field]: v }
                          }));
                        }}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-orange-300"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
                >
                  Save Address
                </button>
              </form>
            </>
          )}

          {/* Account Details */}
          {tab === "account" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">Account Details</h3>
              <form onSubmit={saveAccount} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Full Name</label>
                  <input
                    name="fullName"
                    value={profile.fullName}
                    onChange={(e)=>setProfile(p=>({
                      ...p, [e.target.name]: e.target.value
                    }))}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-orange-300"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    name="email"
                    value={profile.email}
                    disabled
                    className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Phone</label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={(e)=>setProfile(p=>({
                      ...p, [e.target.name]: e.target.value
                    }))}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-orange-300"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
                >
                  Save Details
                </button>
              </form>
            </>
          )}

          {/* show save confirmation */}
          {savingMsg && (
            <p className="mt-4 text-green-600 font-medium">{savingMsg}</p>
          )}
        </main>
      </div>
    </div>
  );
}
