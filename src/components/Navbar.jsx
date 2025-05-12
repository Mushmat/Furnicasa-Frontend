import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Top Green Bar for Discount Line */}
      <div className="bg-green-700 text-white text-center py-2">
        Extra Rs. 10,000 Off in Stores*
      </div>

      {/* Main White Bar */}
      <nav className="bg-white w-full border-b border-gray-200 shadow-sm py-3 fixed top-[2rem] md:top-[2.25rem] z-50">
        {/* Wrapper */}
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Left Section: Brand & (Desktop) Search */}
          <div className="flex items-center space-x-6">
            {/* Hamburger (Mobile) */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {!menuOpen ? (
                <img
                  src="https://www.pixsector.com/cache/f5c37214/av089223b78f583a8e8d6.png"
                  alt="Open Menu"
                  className="w-6 h-6"
                />
              ) : (
                <img
                  src="https://pixsector.com/cache/96937a07/av99d1cc0762c2ea29789.png"
                  alt="Close Menu"
                  className="w-6 h-6"
                />
              )}
            </button>

            {/* Brand Name or Logo */}
            {/* 
              If you want a Furnicasa logo image, use:
              
              <Link to="/">
                <img
                  src="INSERT_YOUR_FURNICASA_LOGO_URL"
                  alt="Furnicasa Logo"
                  className="h-8 object-contain"
                />
              </Link>
            */}
            <Link to="/">
              <span className="text-2xl font-bold text-orange-600 tracking-wide">
                Furnicasa
              </span>
            </Link>

            {/* Search (Desktop) */}
            <div className="hidden md:flex items-center space-x-2 border-b border-gray-400 focus-within:border-gray-600 pb-1">
              <input
                type="text"
                placeholder="Search"
                className="outline-none px-2 text-gray-700 w-64"
              />
              <img
                src="https://images.vexels.com/media/users/3/132068/isolated/preview/f9bb81e576c1a361c61a8c08945b2c48-search-icon.png?w=360"
                alt="Search Icon"
                className="w-4 h-4 text-gray-500"
              />
            </div>
          </div>

          {/* Right Section: Desktop Links & Cart/Auth */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-orange-600">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-600">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-600">
              Contact
            </Link>
            <Link to="/my-orders" className="text-gray-700 hover:text-orange-600">
              My Orders
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-orange-600 flex items-center"
              >
                <img
                  src="https://icons.veryicon.com/png/o/commerce-shopping/wangdianbao-icon-monochrome/administrators-6.png"
                  alt="Admin Icon"
                  className="w-5 h-5 mr-1"
                />
                Admin Panel
              </Link>
            )}

            {/* Promo Text (desktop) */}
            <span className="text-orange-600">Get Extra 10% Off on First Purchase</span>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-orange-600">
              <img
                src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
                alt="Cart Icon"
                className="w-6 h-6"
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-4">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
                  alt="User Icon"
                  className="w-6 h-6"
                />
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-orange-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600"
                >
                  Login
                </Link>
                <Link
                  to="/register-advanced"
                  className="text-gray-700 hover:text-orange-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white p-4 border-t border-gray-200 flex flex-col space-y-4">
            {/* Search (Mobile) */}
            <div className="flex items-center space-x-2 border-b border-gray-400 focus-within:border-gray-600 pb-1">
              <input
                type="text"
                placeholder="Search"
                className="outline-none px-2 text-gray-700 w-full"
              />
              <img
                src="https://images.vexels.com/media/users/3/132068/isolated/preview/f9bb81e576c1a361c61a8c08945b2c48-search-icon.png?w=360"
                alt="Search Icon"
                className="w-4 h-4 text-gray-500"
              />
            </div>

            <Link
              to="/products"
              className="text-gray-700 hover:text-orange-600"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-orange-600"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-orange-600"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/my-orders"
              className="text-gray-700 hover:text-orange-600"
              onClick={() => setMenuOpen(false)}
            >
              My Orders
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-orange-600 flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                <img
                  src="https://icons.veryicon.com/png/o/commerce-shopping/wangdianbao-icon-monochrome/administrators-6.png"
                  alt="Admin Icon"
                  className="w-5 h-5 mr-1"
                />
                Admin Panel
              </Link>
            )}

            {/* Promo Text (mobile) */}
            <span className="text-orange-600">
              Get Extra 10% Off on First Purchase
            </span>

            {/* Cart (Mobile) */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-orange-600"
              onClick={() => setMenuOpen(false)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
                alt="Cart Icon"
                className="w-6 h-6"
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Auth (Mobile) */}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-gray-700 hover:text-orange-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register-advanced"
                  className="text-gray-700 hover:text-orange-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
