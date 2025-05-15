// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { cartItems }                 = useCart();
  const { user, logout }              = useAuth();
  const navigate                       = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* Top Promo */}
      <div className="bg-green-700 text-white text-center py-2 text-sm">
        Extra Rs. 10,000 Off in Stores*
      </div>

      {/* Main Nav */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link to="/" className="text-2xl font-bold text-orange-600">
              Furnicasa
            </Link>

            {/* Centered Links (desktop) */}
            <div className="hidden md:flex space-x-8">
              <Link to="/products" className="text-gray-700 hover:text-orange-600 uppercase tracking-wide">
                Products
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-orange-600 uppercase tracking-wide">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-600 uppercase tracking-wide">
                Contact
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-orange-600 uppercase tracking-wide flex items-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                  </svg>
                  Admin
                </Link>
              )}
            </div>

            {/* Right-side icons */}
            <div className="flex items-center space-x-6">
              {/* Profile */}
              <div className="relative">
                <img
                  onClick={() => setProfileOpen((o) => !o)}
                  src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
                  alt="Account"
                  className="w-6 h-6 cursor-pointer"
                />
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50">
                    {user ? (
                      <>
                        <Link
                          to="/my-account"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/my-account#orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          to="/my-account#address"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileOpen(false)}
                        >
                          Address
                        </Link>
                        <Link
                          to="/my-account#account"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileOpen(false)}
                        >
                          Account Details
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register-advanced"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileOpen(false)}
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
                  alt="Cart"
                  className="w-6 h-6 text-gray-700 hover:text-orange-600"
                />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger */}
              <button className="md:hidden" onClick={() => setMenuOpen((o) => !o)}>
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (no “My Orders” here either) */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <Link to="/products" className="block text-gray-700 hover:text-orange-600">
                Products
              </Link>
              <Link to="/about" className="block text-gray-700 hover:text-orange-600">
                About
              </Link>
              <Link to="/contact" className="block text-gray-700 hover:text-orange-600">
                Contact
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="block text-gray-700 hover:text-orange-600"
                >
                  Admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left text-gray-700 hover:text-orange-600"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-orange-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register-advanced"
                    className="block text-gray-700 hover:text-orange-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
