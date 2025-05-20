// src/pages/Checkout.jsx
import React, { useState, useMemo } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const { cartItems, dispatch } = useCart();
  const navigate  = useNavigate();
  const location  = useLocation();
  const token     = localStorage.getItem("token");

  const discountPercent = location.state?.discountPercent || 0;

  /* helpers */
  const priceAfterDisc = (p) =>
    Math.round(p.price * (1 - (p.discountPercent || 0) / 100));

  /* shipping form */
  const [ship, setShip] = useState({
    fullName: "", address: "", city: "", postalCode: "", country: "", phone: ""
  });
  const handleChange = (e) =>
    setShip({ ...ship, [e.target.name]: e.target.value });

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
  const totalToPay  = subtotal - discountAmt;

  /* pay */
  const pay = async () => {
    try {
      const { data: rzpOrder } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create`,
        { amount: totalToPay },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const opts = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Furnicasa",
        description: "Furniture Purchase",
        order_id: rzpOrder.id,
        handler: async (resp) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
              resp,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const items = cartItems.map((i) => ({
              productId: i.product._id,
              quantity : i.quantity,
              price    : priceAfterDisc(i.product),
            }));

            const { data: order } = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
              { items, shippingAddress: ship, status: "Paid" },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            dispatch({ type: "SET_CART", payload: [] });
            navigate("/order-confirmation", {
              state: { orderId: order._id, totalPrice: order.totalPrice },
            });
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },
        theme: { color: "#F37254" },
      };
      new window.Razorpay(opts).open();
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Checkout</h2>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* shipping */}
        <div>
          <h4 className="font-semibold mb-4">Shipping Details</h4>
          {[
            ["fullName", "Full Name"],
            ["address", "Address"],
            ["city", "City"],
            ["postalCode", "Postal Code"],
            ["country", "Country"],
            ["phone", "Phone Number"],
          ].map(([name, ph]) => (
            <input
              key={name}
              name={name}
              value={ship[name]}
              onChange={handleChange}
              placeholder={ph}
              className="w-full border p-2 rounded mb-3"
            />
          ))}
        </div>

        {/* summary */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-4">Order Summary</h4>

          <ul className="divide-y">
            {cartItems.map((i) => (
              <li key={i.product._id} className="py-2 flex justify-between">
                <span>
                  {i.product.title} × {i.quantity}
                </span>
                <span>
                  ₹{(priceAfterDisc(i.product) * i.quantity).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({discountPercent}%)</span>
                <span>-₹{discountAmt.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total to Pay</span>
              <span>₹{totalToPay.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={pay}
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
