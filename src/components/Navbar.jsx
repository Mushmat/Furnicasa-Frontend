// src/components/Navbar.jsx
import { useState } from "react";
import { FiShoppingCart, FiMenu, FiX, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-orange-600 text-white px-6 py-4 shadow-md fixed w-full top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Brand Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Furnicasa
        </Link>

        {/* Search (Desktop) */}
        <input
          type="text"
          placeholder="Search furniture..."
          className="hidden md:block px-3 py-1 w-80 rounded-md text-black"
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/products" className="hover:text-gray-200">
            Products
          </Link>
          <Link to="/about" className="hover:text-gray-200">
            About
          </Link>
          <Link to="/contact" className="hover:text-gray-200">
            Contact
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative hover:text-gray-200">
            <FiShoppingCart className="text-2xl cursor-pointer" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <Link to="/my-orders" className="hover:text-gray-200">
          My Orders
          </Link>
          {user ? (
            // If user is logged in, show Profile Icon + Logout
            <div className="flex items-center space-x-4">
              <FiUser className="text-2xl" />
              <button
                onClick={logout}
                className="hover:text-gray-300"
                title="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            // If no user, show Login/Register
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
              <Link to="/register-advanced" className="hover:text-gray-200">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          {menuOpen ? (
            <FiX
              className="text-3xl cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
          ) : (
            <FiMenu
              className="text-3xl cursor-pointer"
              onClick={() => setMenuOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col space-y-4 bg-orange-700 p-4">
          <Link
            to="/products"
            className="hover:text-gray-300"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/about"
            className="hover:text-gray-300"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-gray-300"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          {/* Cart (Mobile) */}
          <Link
            to="/cart"
            className="relative hover:text-gray-300"
            onClick={() => setMenuOpen(false)}
          >
            <FiShoppingCart className="text-2xl cursor-pointer" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <FiUser className="text-2xl" />
                <span>{user.email}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="hover:text-gray-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register-advanced"
                className="hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
