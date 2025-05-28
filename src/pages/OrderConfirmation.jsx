import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const { state } = useLocation();            // { orderId, totalPrice }
  const navigate  = useNavigate();
  const { orderId, totalPrice } = state || {};

  /* if someone lands here directly, bounce home */
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
          <strong>Expected&nbsp;Delivery:</strong> 4-6 business weeks
        </p>

        {/* guidance */}
        <p className="text-sm text-gray-600 mb-6 text-center">
          You can view the full invoice and tracking details anytime in&nbsp;
          <strong>Dashboard → Orders</strong>.
        </p>

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
