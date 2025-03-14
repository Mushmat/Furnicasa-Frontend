import { useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-orange-600 text-white px-6 py-4 shadow-md fixed w-full top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-2xl font-bold tracking-wide">Furnicasa</Link>

        <input
          type="text"
          placeholder="Search furniture..."
          className="hidden md:block px-3 py-1 w-80 rounded-md text-black"
        />

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/products" className="hover:text-gray-200">Products</Link>
          <Link to="/about" className="hover:text-gray-200">About</Link>
          <Link to="/contact" className="hover:text-gray-200">Contact</Link>
          <FiShoppingCart className="text-2xl cursor-pointer hover:text-gray-200" />
          <FiUser className="text-2xl cursor-pointer hover:text-gray-200" />
        </div>

        <div className="md:hidden">
          {menuOpen ? (
            <FiX className="text-3xl cursor-pointer" onClick={() => setMenuOpen(false)} />
          ) : (
            <FiMenu className="text-3xl cursor-pointer" onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col space-y-4 bg-orange-700 p-4">
          <Link to="/products" className="hover:text-gray-300">Products</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
