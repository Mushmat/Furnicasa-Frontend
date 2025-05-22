import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderConfirmation() {
  const { state }  = useLocation();          // { orderId, totalPrice }
  const navigate   = useNavigate();
  const token      = localStorage.getItem("token");
  const { orderId, totalPrice } = state || {};

  const [order, setOrder] = useState(null);
  const [err,   setErr]   = useState("");

  /* fetch full order once we have an id */
  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(data);
      } catch {
        setErr("Could not load order details.");
      }
    })();
  }, [orderId, token]);

  /* if no order id (e.g. direct visit) → bounce home */
  useEffect(() => {
    if (!orderId) navigate("/");
  }, [orderId, navigate]);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">
          🎉 Thank You for Your Purchase!
        </h2>

        {/* summary */}
        <p className="text-gray-700 mb-1 text-center">
          Your order has been placed successfully.
        </p>
        <p className="text-gray-600 mb-1 text-center">
          <strong>Order&nbsp;ID:</strong> {orderId}
        </p>
        <p className="text-gray-600 mb-1 text-center">
          <strong>Total&nbsp;Paid:</strong> ₹{totalPrice}
        </p>
        <p className="text-gray-600 mb-6 text-center">
          <strong>Expected&nbsp;Delivery:</strong> 15-21 business days
        </p>

        {/* items */}
        {err && <p className="text-red-600">{err}</p>}
        {order && (
          <div className="space-y-4 mb-6">
            {order.items.map((it) => (
              <Link
                key={it._id}
                to={`/product/${it.product?._id || ""}`}
                className="flex items-center space-x-4 hover:bg-gray-50 p-2 rounded"
              >
                <img
                  src={it.product?.imageUrl.replace("http://", "https://")}
                  alt={it.product?.title}
                  className="w-20 h-20 object-contain border rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{it.product?.title || "Removed"}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {it.quantity} &nbsp;|&nbsp; ₹
                    {(it.price * it.quantity).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/products"
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
