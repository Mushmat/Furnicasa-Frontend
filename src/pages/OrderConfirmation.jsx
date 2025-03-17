import { Link, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, totalPrice } = location.state || {};

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Thank You for Your Purchase!
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Order ID:</strong> {orderId}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Total Paid:</strong> ₹{totalPrice}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Expected Delivery:</strong> 15-21 business days
        </p>

        <Link
          to="/products"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
