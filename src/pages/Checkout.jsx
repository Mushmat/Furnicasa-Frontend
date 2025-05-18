// src/pages/Checkout.jsx
import React, { useState, useMemo } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const { cartItems, dispatch } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  // get discount percent or default to 0
  const discountPercent = location.state?.discountPercent || 0;

  // shipping form state
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // compute subtotal using discounted unit prices
  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const orig = item.product.price;
        const disc = item.product.discount || 0;
        const unit = orig * (100 - disc) / 100;
        return sum + unit * item.quantity;
      }, 0),
    [cartItems]
  );

  const discountAmount = useMemo(
    () => (subtotal * discountPercent) / 100,
    [subtotal, discountPercent]
  );

  const totalToPay = useMemo(() => subtotal - discountAmount, [
    subtotal,
    discountAmount,
  ]);

  const handleChange = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      // 1️⃣ Create Razorpay order for the discounted total
      const { data: razorpayOrder } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create`,
        { amount: totalToPay },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Furnicasa",
        description: "Furniture Purchase",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // verify…
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
              { ...response },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // create order record with discounted total
            const items = cartItems.map((item) => ({
              productId: item.product._id,
              quantity: item.quantity,
              price: item.product.price * (100 - (item.product.discount||0)) / 100,
            }));

            const { data: newOrder } = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
              {
                items,
                shippingAddress: shipping,
                status: "Paid",
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // clear cart & go to confirmation
            dispatch({ type: "SET_CART", payload: [] });
            navigate("/order-confirmation", {
              state: {
                orderId: newOrder._id,
                totalPrice: newOrder.totalPrice,
              },
            });
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },
        theme: { color: "#F37254" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Checkout</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div>
          <h4 className="font-semibold mb-4">Shipping Details</h4>
          {[
            { name: "fullName", placeholder: "Full Name" },
            { name: "address", placeholder: "Address" },
            { name: "city", placeholder: "City" },
            { name: "postalCode", placeholder: "Postal Code" },
            { name: "country", placeholder: "Country" },
            { name: "phone", placeholder: "Phone Number" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={shipping[field.name]}
              onChange={handleChange}
              className="block w-full border p-2 rounded mb-3"
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-4">Order Summary</h4>

          <ul className="divide-y">
            {cartItems.map((item) => {
              const orig = item.product.price;
              const disc = item.product.discount || 0;
              const unit = orig * (100 - disc) / 100;
              return (
                <li
                  key={item.product._id}
                  className="py-2 flex justify-between"
                >
                  <span>
                    {item.product.title} × {item.quantity}
                  </span>
                  <span>₹{(unit * item.quantity).toFixed(2)}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({discountPercent}%)</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total to Pay</span>
              <span>₹{totalToPay.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
