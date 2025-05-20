// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { dispatch } = useCart();

  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [qty, setQty]           = useState(1);
  const [tab, setTab]           = useState("description");
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
        );
        setProduct(data);

        const { data: all } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );
        setRelated(
          all
            .filter((p) => p._id !== id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
        );
      } catch {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
      { productId: product._id, quantity: qty },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch({ type: "ADD", payload: { product, quantity: qty } });
  };

  if (loading) return <p className="p-4">Loading…</p>;
  if (error)   return <p className="p-4 text-red-600">{error}</p>;

  const { price, discountPercent: discount = 0 } = product;
  const finalPrice = Math.round(price * (1 - discount / 100));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link to="/">Home</Link> / {product.title}
      </nav>

      {/* top section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* image wrapper enforces consistent aspect/height */}
        <div className="w-full h-64 md:h-96 lg:h-[500px] flex items-center justify-center border">
          <img
            src={product.imageUrl.replace("http://", "https://")}
            alt={product.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* details */}
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
              <span className="ml-1 text-green-600">(-{discount}%)</span>
            )}
          </p>

          {/* quantity */}
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)}>＋</button>
          </div>

          <button
            onClick={addToCart}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* description / reviews */}
      <div className="mt-12">
        <div className="flex border-b mb-4">
          {["description", "reviews"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 px-4 ${
                tab === t ? "border-b-2 border-blue-600" : ""
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "description" && (
          Object.keys(product.specs || {}).length ? (
            <div className="grid sm:grid-cols-2 gap-y-1 mt-4">
              {Object.entries(product.specs).map(([k, v]) => (
                <React.Fragment key={k}>
                  <p className="font-medium">{k}</p>
                  <p>{v}</p>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="mt-4">{product.description}</p>
          )
        )}

        {tab === "reviews" && <p className="mt-4">No reviews yet.</p>}
      </div>

      {/* related */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => {
            const fp = Math.round(
              p.price * (1 - (p.discountPercent || 0) / 100)
            );
            return (
              <Link key={p._id} to={`/product/${p._id}`} className="block p-4 border rounded-lg">
                <img
                  src={p.imageUrl.replace("http://", "https://")}
                  alt={p.title}
                  className="w-full h-40 object-contain"
                />
                <h3 className="mt-2 line-clamp-2">{p.title}</h3>
                <p className="mt-1">
                  {p.discountPercent > 0 && (
                    <span className="line-through text-gray-500 mr-1">
                      ₹{p.price.toLocaleString()}
                    </span>
                  )}
                  <span className="text-orange-600">
                    ₹{fp.toLocaleString()}
                  </span>
                  {p.discountPercent > 0 && (
                    <span className="ml-1 text-green-600 text-sm">
                      -{p.discountPercent}%
                    </span>
                  )}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
