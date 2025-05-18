import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id }  = useParams();
  const { dispatch } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty]         = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
        );
        setProduct(data);

        const { data: all } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );
        const others = all
          .filter((p) => p._id !== data._id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setRelated(others);
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data: updatedCart } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: product._id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "SET_CART", payload: updatedCart });
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Could not add to cart.");
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;
  if (error)   return <p className="p-4 text-red-600">{error}</p>;

  /* prices */
  const { price, discount = 0 } = product;
  const finalPrice = Math.round(price * (1 - discount / 100));

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-gray-600 mb-6">
        <Link to="/">Home</Link> / <span>{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-auto object-contain rounded-lg shadow"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

          <p className="text-2xl mb-4">
            {discount > 0 && (
              <span className="line-through text-gray-500 mr-2">
                ₹{price.toLocaleString()}
              </span>
            )}
            <span className="text-orange-600 font-semibold">
              ₹{finalPrice.toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="ml-1 text-green-600 text-base">
                (-{discount}%)
              </span>
            )}
          </p>

          <p className="mb-6">{product.description}</p>

          {/* qty */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border rounded"
            >
              –
            </button>
            <span className="font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>

          <button
            onClick={addToCart}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-12">
        <div className="flex border-b mb-4">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="prose">
          {activeTab === "description" &&
            (Object.keys(product.specs || {}).length === 0 ? (
              <p>{product.description || "No additional details."}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1">
                {Object.entries(product.specs).map(([k, v]) => (
                  <React.Fragment key={k}>
                    <p className="font-medium">{k}</p>
                    <p className="text-gray-700">{v}</p>
                  </React.Fragment>
                ))}
              </div>
            ))}
          {activeTab === "reviews" && <p>No reviews yet.</p>}
        </div>
      </div>

      {/* related */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => {
            const fp = Math.round(p.price * (1 - (p.discount || 0) / 100));
            return (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-40 object-contain bg-white"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-1 line-clamp-2">{p.title}</h3>
                  <p className="text-orange-600 font-semibold">₹{fp}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
