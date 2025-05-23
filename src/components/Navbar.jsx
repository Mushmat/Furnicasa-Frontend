import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react";

/* 📝 edit / reorder any time */
const categories = ["Sofas", "Bed", "Dining Sets", "Chairs"];

export default function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { cartItems } = useCart();
  const { items: wishItems } = useWishlist();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  /* helper → go to /products with pre-selected category */
  const jumpCat = (cat) => {
    navigate("/products", { state: { category: cat } });
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        {/* ───── main row ───── */}
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <Link to="/" className="text-2xl font-bold text-orange-600">
            Furnicasa
          </Link>

          {/* center links (desktop) */}
          <div className="hidden md:flex space-x-8">
            {["Products", "About", "Contact"].map((txt) => (
              <Link
                key={txt}
                to={`/${txt.toLowerCase()}`}
                className="text-gray-700 hover:text-orange-600 uppercase tracking-wide"
              >
                {txt}
              </Link>
            ))}
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

          {/* right icons */}
          <div className="flex items-center space-x-6">
            {/* profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="w-7 h-7 flex items-center justify-center"
              >
                {/* Heroicons user-circle outline */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-7 h-7 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5a8.999 8.999 0 0115 0"
                  />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50">
                  {user ? (
                    <>
                      <Link to="/my-account"       onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                      <Link to="/my-account#orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login"             onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                      <Link to="/register-advanced" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* wishlist */}
            <Link to="/wishlist" className="relative">
              <Heart className="w-6 h-6 text-gray-700 hover:text-orange-600" />
              {wishItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishItems.length}
                </span>
              )}
            </Link>

            {/* cart */}
            <Link to="/cart" className="relative">
              <img src="https://cdn-icons-png.flaticon.com/512/263/263142.png" alt="Cart" className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* mobile burger */}
            <button className="md:hidden" onClick={() => setMenuOpen((o) => !o)}>
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor">
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

      {/* ───── category bar (desktop) ───── */}
      <div className="hidden md:flex justify-center space-x-6 py-2 bg-white border-t border-gray-100">
        {categories.map((cat) => (
          <button key={cat} onClick={() => jumpCat(cat)} className="text-sm hover:text-orange-600">
            {cat}
          </button>
        ))}
      </div>

      {/* ───── mobile dropdown ───── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {["Products", "About", "Contact"].map((txt) => (
              <Link key={txt} to={`/${txt.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block">
                {txt}
              </Link>
            ))}

            {/* categories */}
            <div className="border-t pt-3">
              {categories.map((cat) => (
                <button key={cat} onClick={() => jumpCat(cat)} className="block w-full text-left py-1">
                  {cat}
                </button>
              ))}
            </div>

            <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block">
              Wishlist
            </Link>

            {user ? (
              <button onClick={handleLogout} className="block text-left w-full">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login"             onClick={() => setMenuOpen(false)} className="block">Login</Link>
                <Link to="/register-advanced" onClick={() => setMenuOpen(false)} className="block">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
