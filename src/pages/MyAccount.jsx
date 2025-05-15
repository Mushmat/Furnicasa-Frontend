// src/pages/MyAccount.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const MyAccount = () => {
  const { user } = useAuth();          // logout stays in Navbar only
  const [tab, setTab] = useState("dashboard");

  return (
    <div id="main-wrapper">
      {/* ────────────────── Page banner ────────────────── */}
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

      {/* ────────────────── Content ────────────────── */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4">
          <nav className="bg-white shadow p-4 flex flex-col space-y-2">
            {[
              { key: "dashboard", label: "Dashboard" },
              { key: "orders",    label: "Orders"    },
              { key: "address",   label: "Address"   },
              { key: "account",   label: "Account Details" },
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

        {/* Main panel */}
        <main className="flex-1 bg-white shadow p-6">
          {tab === "dashboard" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">Dashboard</h3>
              <p className="mb-4">
                Hello, <strong>{user?.fullName || user?.email}</strong>!
              </p>
              <p>
                From your dashboard you can view your recent orders, manage
                addresses and update your account details.
              </p>
            </>
          )}

          {tab === "orders" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">Orders</h3>
              <p>Your past orders will appear here.</p>
            </>
          )}

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

          {tab === "account" && (
            <>
              <h3 className="text-2xl font-semibold mb-4">Account Details</h3>
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
