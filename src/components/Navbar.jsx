import { useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-orange-700 text-white px-6 py-4 shadow-md fixed w-full top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold tracking-wide">
          Furnicasa
        </a>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search furniture..."
          className="hidden md:block px-3 py-1 w-80 rounded-md text-black"
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="/categories" className="hover:text-gray-300">Categories</a>
          <a href="/about" className="hover:text-gray-300">About</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
          <FiShoppingCart className="text-2xl cursor-pointer" />
          <FiUser className="text-2xl cursor-pointer" />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          {menuOpen ? (
            <FiX className="text-3xl cursor-pointer" onClick={() => setMenuOpen(false)} />
          ) : (
            <FiMenu className="text-3xl cursor-pointer" onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col space-y-4 bg-orange-800 p-4">
          <a href="/categories" className="hover:text-gray-300">Categories</a>
          <a href="/about" className="hover:text-gray-300">About</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
