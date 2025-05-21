// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const fetchCart = async (dispatch) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // assuming the route returns { items: [...] }
  dispatch({ type: "SET_CART", payload: data.items || [] });
};


const MAX_QTY = 10;      // 🚦 hard-cap per item

export default function ProductDetail() {
  const { id }       = useParams();
  const { dispatch } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty]         = useState(1);
  const [tab, setTab]         = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  /* ── fetch product + 8 random “related” ───────────────────────── */
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
            .slice(0, 8)                            // ⬅️ eight items
        );
      } catch {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ── cart action with qty ≤ 5 ─────────────────────────────────── */
  const addToCart = async () => {
  const token = localStorage.getItem("token");

  // 1️⃣ send the add request
  await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
    { productId: product._id, quantity: qty },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // 2️⃣ pull the fresh cart and hydrate context
  await fetchCart(dispatch);
};


  /* ── qty helpers with cap + polite notice ─────────────────────── */
  const changeQty = (delta) => {
    const next = qty + delta;
    if (next < 1) return;
    if (next > MAX_QTY) {
      alert("For orders above 10 units please contact us directly.");
      return;
    }
    setQty(next);
  };

  /* ── early returns ────────────────────────────────────────────── */
  if (loading) return <p className="p-4">Loading…</p>;
  if (error)   return <p className="p-4 text-red-600">{error}</p>;

  const { price, discountPercent: discount = 0 } = product;
  const finalPrice = Math.round(price * (1 - discount / 100));

  /* ── markup ───────────────────────────────────────────────────── */
  return (
    <div className="container mx-auto px-4 py-8">
      {/* breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link to="/">Home</Link> / {product.title}
      </nav>

      {/* top grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* image box keeps aspect ratio uniform */}
        <div className="w-full h-64 md:h-96 lg:h-[500px] flex items-center justify-center border">
          <img
            src={product.imageUrl.replace("http://", "https://")}
            alt={product.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* right-hand details + description/specs */}
        <div className="flex flex-col space-y-6">
          {/* title & price */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-2xl">
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
          </div>

          {/* qty picker */}
          <div className="flex items-center space-x-4">
            <button onClick={() => changeQty(-1)} className="text-xl">−</button>
            <span>{qty}</span>
            <button
              onClick={() => changeQty(1)}
              className={`text-xl ${qty === MAX_QTY && "opacity-40 cursor-not-allowed"}`}
            >
              ＋
            </button>
          </div>

          {/* add-to-cart */}
          <button
            onClick={addToCart}
            className="bg-blue-600 text-white px-6 py-2 rounded w-max"
          >
            Add to Cart
          </button>

          {/* ── description / reviews tabs now live right here ── */}
          <div>
            <div className="flex border-b mb-2">
              {["description", "reviews"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`py-2 px-4 text-sm ${
                    tab === t ? "border-b-2 border-blue-600" : ""
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {tab === "description" &&
              (Object.keys(product.specs || {}).length ? (
                <div className="grid sm:grid-cols-2 gap-y-1 text-sm">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <React.Fragment key={k}>
                      <p className="font-medium">{k}</p>
                      <p>{v}</p>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <p className="text-sm">{product.description}</p>
              ))}

            {tab === "reviews" && (
              <p className="text-sm italic">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* related products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => {
            const fp = Math.round(
              p.price * (1 - (p.discountPercent || 0) / 100)
            );
            return (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="block p-4 border rounded-lg"
              >
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
}
