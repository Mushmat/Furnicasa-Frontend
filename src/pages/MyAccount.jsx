// src/pages/MyAccount.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const MyAccount = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");

  return (
    <div id="main-wrapper">
      {/* Banner */}
      {/* Banner */}
      <section
        className="page-banner-section bg-cover bg-center h-[330px]"
        style={{
          backgroundImage: "url('/assets/images/bg/breadcrumb.png')",
        }}
      >
        <div className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-semibold">My Account</h2>
          <nav className="text-sm mt-2 text-gray-600">
            <ol className="flex space-x-2">
              <li><a href="/" className="hover:underline">Home</a></li>
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
            <button
              onClick={() => setTab("dashboard")}
              className={`text-left p-2 rounded ${
                tab === "dashboard"
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setTab("orders")}
              className={`text-left p-2 rounded ${
                tab === "orders"
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Orders
            </button>

            <button
              onClick={() => setTab("address")}
              className={`text-left p-2 rounded ${
                tab === "address"
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Address
            </button>

            <button
              onClick={() => setTab("account")}
              className={`text-left p-2 rounded ${
                tab === "account"
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Account Details
            </button>

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
                Hello, <strong>{user?.fullName || user?.email}</strong>!{" "}
                <button
                  onClick={logout}
                  className="text-orange-600 hover:underline ml-2"
                >
                  Logout
                </button>
              </p>
              <p>
                From your account dashboard you can easily check & view your
                recent orders, manage your shipping and billing addresses, and
                edit your password and account details.
              </p>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Orders</h3>
              {/* TODO: replace with real order list */}
              <p>Your past orders will appear here.</p>
            </div>
          )}

          {tab === "address" && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Billing Address</h3>
              {/* TODO: fetch & show actual address */}
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
//CHanges to my account