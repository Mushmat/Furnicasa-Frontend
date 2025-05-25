import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";        // ← icon
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const { items, remove } = useWishlist();
  const { dispatch } = useCart();

  const moveToCart = async (wish) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: wish.product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "ADD", payload: { product: wish.product, quantity: 1 } });
    } catch (err) {
      console.error(err);
      alert("Could not add to cart, please try again.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {items.length === 0 ? (
        /* ----- pretty empty state ----- */
        <div className="flex flex-col items-center justify-center py-24 text-gray-600">
          <FiHeart size={64} className="mb-4 text-orange-500" />
          <p className="text-lg">Your wishlist is empty.</p>
          <Link to="/products" className="mt-2 text-green-600 hover:underline">
            Browse products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((wish) => {
            const p   = wish.product;
            const img = p.imageUrl.replace("http://", "https://");

            return (
              <div key={wish._id} className="bg-white rounded shadow p-4 flex flex-col">
                <Link to={`/product/${p._id}`}>
                  <img src={img} alt={p.title} className="w-full h-48 object-contain mb-3" />
                  <h3 className="font-medium line-clamp-2 text-sm">{p.title}</h3>
                </Link>

                <div className="mt-auto flex justify-between items-center pt-4">
                  <button
                    onClick={() => moveToCart(wish)}
                    className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => remove(wish._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
