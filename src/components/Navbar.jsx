// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react";

const categories = ["sofas", "bed", "dining sets", "chairs", "center tables"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { cartItems } = useCart();
  const { items: wishes } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const gotoCat = (cat) => {
    const path = "/products" + (cat && cat !== "all" ? `?category=${encodeURIComponent(cat)}` : "");
    navigate(path, { state: { category: cat } });
    setMenuOpen(false);
  };

  const runSearch = () => {
    const term = search.trim();
    if (!term) return;
    // exact match?
    const hit = categories.find((c) => c.toLowerCase() === term.toLowerCase());
    if (hit) return gotoCat(hit);
    navigate(`/products?q=${encodeURIComponent(term)}`);
    setMenuOpen(false);
    setSearch("");
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center h-16">
        {/* logo */}
        <Link to="/" className="text-2xl font-bold text-orange-600">
          Furnicasa
        </Link>

        {/* expanded search bar */}
        <div className="flex-1 px-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="Search products…"
              className="w-full border rounded-full pl-4 pr-10 py-1.5 text-sm focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={runSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* right-hand icons */}
        <div className="flex items-center space-x-5">
          {/* profile */}
          <div className="relative">
            <button
              title="Profile"
              onClick={() => setProfileOpen((o) => !o)}
              className="w-6 h-6 flex items-center justify-center"
            >
              {/* user icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-6 h-6 text-gray-700 hover:text-orange-600"
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
                    <Link
                      to="/my-account"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my-account#orders"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Orders
                    </Link>

                    {/* ➜ NEW: Admin link (desktop) */}
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Admin&nbsp;Dashboard
                      </Link>
                    )}



                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register-advanced"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* wishlist */}
          <Link to="/wishlist" title="Wishlist" className="relative">
            <Heart className="w-6 h-6 text-gray-700 hover:text-orange-600" />
            {wishes.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                {wishes.length}
              </span>
            )}
          </Link>

          {/* cart */}
          <Link to="/cart" title="Cart" className="relative">
            <img
              src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
              alt="Cart"
              className="w-6 h-6"
            />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* mobile menu toggle */}
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* desktop category bar */}
      <div className="hidden lg:flex justify-center space-x-6 py-2 bg-white border-t border-gray-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => gotoCat(cat)}
            className="text-sm hover:text-orange-600"
          >
            {cat.replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
        {/* All Products at end */}
        <button
          onClick={() => gotoCat("all")}
          className="text-sm hover:text-orange-600"
        >
          All Products
        </button>
      </div>
      
      {/* mobile dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* nav links */}
            {["Products","About","Contact"].map((txt)=>(
              <Link key={txt} to={`/${txt.toLowerCase()}`} onClick={()=>setMenuOpen(false)} className="block">
                {txt}
              </Link>
            ))}

            {/* search */}
            <div className="flex space-x-2 items-center border rounded px-3 py-1">
              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                onKeyDown={(e)=>e.key==="Enter"&&runSearch()}
                placeholder="Search…"
                className="flex-1 text-sm outline-none"
              />
              <button onClick={runSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
              </button>
            </div>

            {/* categories */}
            <div className="border-t pt-3">
              {categories.map((cat)=>(
                <button key={cat} onClick={()=>gotoCat(cat)} className="block w-full text-left py-1">
                  {cat.replace(/\b\w/g,(c)=>c.toUpperCase())}
                </button>
              ))}
            </div>

            <Link to="/wishlist" onClick={()=>setMenuOpen(false)} className="block">Wishlist</Link>
            
             {/* ➜ NEW: Admin link (mobile) */}
            {user?.isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block"
              >
                Admin&nbsp;Dashboard
              </Link>
            )}
            
            {user ? (
              <button onClick={handleLogout} className="block text-left w-full">Logout</button>
            ) : (
              <>
                <Link to="/login"             onClick={()=>setMenuOpen(false)} className="block">Login</Link>
                <Link to="/register-advanced" onClick={()=>setMenuOpen(false)} className="block">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
