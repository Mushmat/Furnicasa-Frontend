// src/pages/Cart.jsx
import React, { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";

import { FiTrash2, FiShoppingCart } from "react-icons/fi";  // ← icon
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, dispatch } = useCart();
  const token = localStorage.getItem("token");

  /* coupon */
  const [couponCode,      setCouponCode]      = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError,     setCouponError]     = useState("");

  /* helpers */
  const priceAfterDisc = (p) =>
    Math.round(p.price * (1 - (p.discountPercent || 0) / 100));

  /* mutations */
  const remove = async (id) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/remove/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "SET_CART", payload: data });
    } catch (err) {
      console.error(err);
    }
  };
  const updateQty = async (id, q) => {
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update/${id}`,
        { newQuantity: q },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "SET_CART", payload: data });
    } catch (err) {
      console.error(err);
    }
  };

  /* totals */
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + priceAfterDisc(item.product) * item.quantity,
        0
      ),
    [cartItems]
  );
  const discountAmt = (subtotal * discountPercent) / 100;
  const grandTotal  = subtotal - discountAmt;

  /* coupon apply */
  const apply = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "FIRST10")      { setDiscountPercent(10); setCouponError(""); }
    else if (code === "BUMPER15"){ setDiscountPercent(15); setCouponError(""); }
    else                         { setDiscountPercent(0);  setCouponError("Invalid code"); }
  };

  if (!cartItems.length)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-600">
        <FiShoppingCart size={64} className="mb-4 text-orange-500" />
        <p className="text-lg">Your cart is empty.</p>
        <Link to="/products" className="mt-2 text-green-600 hover:underline">
          Continue shopping →
        </Link>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Shopping Cart</h2>

      {/* table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {["Image", "Product", "Price", "Qty", "Subtotal", ""].map((h) => (
                <th key={h} className="p-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => {
              const fp = priceAfterDisc(item.product);
              return (
                <tr key={item.product._id} className="border-b">
                  <td className="p-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="h-16 w-16 object-contain"
                    />
                  </td>
                  <td className="p-3">{item.product.title}</td>
                  <td className="p-3 text-right">₹{fp}</td>
                  <td className="p-3">
                    <div className="inline-flex items-center space-x-2">
                      <button
                        onClick={() =>
                          item.quantity > 1 &&
                          updateQty(item.product._id, item.quantity - 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQty(item.product._id, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    ₹{(fp * item.quantity).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => remove(item.product._id)}
                      className="text-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* coupon & totals */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-3">Have a coupon?</h4>
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              onClick={apply}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Apply
            </button>
          </div>
          {couponError && <p className="text-red-600 mt-2">{couponError}</p>}
          {discountPercent > 0 && (
            <p className="text-green-600 mt-2">
              Applied {discountPercent}% off
            </p>
          )}
        </div>

        <div className="w-full lg:w-1/3 bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-4">Cart Totals</h4>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between text-green-600 mb-2">
              <span>Coupon ({discountPercent}%)</span>
              <span>-₹{discountAmt.toLocaleString()}</span>
            </div>
          )}
          <div className="border-t my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>

          <Link
            to="/checkout"
            state={{ discountPercent }}
            className="mt-4 block text-center bg-green-600 text-white px-4 py-2 rounded"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
