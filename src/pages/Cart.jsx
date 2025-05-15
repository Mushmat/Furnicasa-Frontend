// src/pages/Cart.jsx
import React, { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, dispatch } = useCart();

  // coupon state
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");

  const token = localStorage.getItem("token");

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update/${productId}`,
        { newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const incrementQuantity = (productId, currentQty) => {
    updateQuantity(productId, currentQty + 1);
  };

  const decrementQuantity = (productId, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  // compute subtotal
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const discountAmount = useMemo(
    () => (subtotal * discountPercent) / 100,
    [subtotal, discountPercent]
  );

  const grandTotal = useMemo(
    () => subtotal - discountAmount,
    [subtotal, discountAmount]
  );

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "FIRST10") {
      setDiscountPercent(10);
      setCouponError("");
    } else if (code === "BUMPER15") {
      setDiscountPercent(15);
      setCouponError("");
    } else {
      setDiscountPercent(0);
      setCouponError("Invalid coupon code");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg">Your cart is empty.</p>
        <Link to="/products" className="text-green-600 hover:underline">
          Continue shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Shopping Cart</h2>
      
      {/* Cart Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-center">Quantity</th>
              <th className="p-3 text-right">Subtotal</th>
              <th className="p-3 text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.product._id} className="border-b">
                <td className="p-3">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="h-16 w-16 object-contain"
                  />
                </td>
                <td className="p-3">
                  <h3 className="font-medium">{item.product.title}</h3>
                </td>
                <td className="p-3 text-right">₹{item.product.price}</td>
                <td className="p-3 text-center">
                  <div className="inline-flex items-center space-x-2">
                    <button
                      onClick={() =>
                        decrementQuantity(item.product._id, item.quantity)
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        incrementQuantity(item.product._id, item.quantity)
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-3 text-right">
                  ₹{item.product.price * item.quantity}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coupon & Summary */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
        {/* Coupon */}
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-3">Have a coupon?</h4>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 border px-3 py-2 rounded focus:outline-none"
            />
            <button
              onClick={handleApplyCoupon}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
          {couponError && (
            <p className="mt-2 text-sm text-red-600">{couponError}</p>
          )}
          {discountPercent > 0 && (
            <p className="mt-2 text-sm text-green-600">
              Code applied: {discountPercent}% off
            </p>
          )}
        </div>

        {/* Totals */}
        <div className="w-full lg:w-1/3 bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-4">Cart Totals</h4>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between text-green-600 mb-2">
              <span>Discount ({discountPercent}%)</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t my-2"></div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            state={{ discountPercent }} 
            className="mt-4 block text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
