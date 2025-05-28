// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const fetchCart = async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  /* accept either shape → []  OR  {items:[]} */
  const items = Array.isArray(data) ? data : data.items || [];
  dispatch({ type: "SET_CART", payload: items });
};


const MAX_QTY = 10;      // 🚦 hard-cap per item

export default function ProductDetail() {
  const { id }       = useParams();
  const { dispatch } = useCart();
  const navigate     = useNavigate();

  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [qty,      setQty]      = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  /* NEW – review state */
  const [reviews,  setReviews]  = useState([]);
  const [rating,   setRating]   = useState(5);
  const [comment,  setComment]  = useState("");
  const token = localStorage.getItem("token");

  /* ─ fetch product, related items, and reviews ─ */
  useEffect(() => {
    (async () => {
      try {
        const [{ data: prod }, { data: all }, { data: rev }] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/reviews`)
        ]);

        setProduct(prod);
        setRelated(
          all.filter((p) => p._id !== id).sort(() => 0.5 - Math.random()).slice(0, 8)
        );
        setReviews(rev);
      } catch {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
  
    /* guests must sign in first */
    if (!token) {
      alert("Please sign in to add items to your cart.");
      return;
    }
  
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: product._id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(dispatch);                // refresh context
    } catch (err) {
      alert("Couldn’t add to cart. Please try again.");
    }
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

  /* submit review */
  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please sign in to leave a review.");
      return navigate("/login");
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(5);
      setComment("");
      const { data: rev } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/reviews`
      );
      setReviews(rev);                               // refresh list
    } catch {
      alert("Could not save review. Please try again.");
    }
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
       {/* ───────────────────  REVIEWS  ─────────────────── */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {/* average & count */}
        {reviews.length > 0 ? (
          <div className="mb-4 flex items-center space-x-2">
            <p className="font-medium">
              {(
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              ).toFixed(1)}{" "}
              / 5
            </p>
            <span className="text-sm text-gray-600">
              ({reviews.length} review{reviews.length > 1 && "s"})
            </span>
          </div>
        ) : (
          <p className="mb-4 text-sm text-gray-600">No reviews yet.</p>
        )}

        {/* list */}
        <div className="space-y-4 mb-8">
          {reviews.map((r) => (
            <div key={r._id} className="border rounded p-4">
              <p className="font-medium">
                {"★".repeat(r.rating).padEnd(5, "☆")}
              </p>
              <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
              <p className="text-xs text-gray-500 mt-1">
                — {r.name} on {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* form */}
        <form onSubmit={submitReview} className="max-w-md space-y-3">
          <label className="block">
            <span className="text-sm font-medium">Your rating</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 border rounded px-2 py-1 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} – {["Poor","Fair","Good","Very good","Excellent"][5-n]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Your review</span>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              className="mt-1 w-full border rounded px-2 py-1 text-sm"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Submit Review
          </button>
        </form>
        </div>
    </div>
  );
}
