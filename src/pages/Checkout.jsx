import React, { useState, useMemo } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const { cartItems, dispatch } = useCart();
  const navigate  = useNavigate();
  const location  = useLocation();
  const discountPercent = location.state?.discountPercent || 0;

  const priceAfterDisc = (p) =>
    Math.round(p.price * (1 - (p.discount || 0) / 100));

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + priceAfterDisc(item.product) * item.quantity,
        0
      ),
    [cartItems]
  );
  const couponDisc = (subtotal * discountPercent) / 100;
  const totalToPay = subtotal - couponDisc;

  /* shipping form */
  const [shipping, setShipping] = useState({
    fullName: "", address: "", city: "", postalCode: "", country: "", phone: "",
  });
  const handleChange = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      // create Razorpay order
      const { data: rzOrder } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create`,
        { amount: totalToPay },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzOrder.amount,
        currency: rzOrder.currency,
        name: "Furnicasa",
        description: "Furniture Purchase",
        order_id: rzOrder.id,
        handler: async (resp) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
              resp,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const items = cartItems.map(({ product, quantity }) => ({
              productId: product._id,
              quantity,
              price: priceAfterDisc(product),
            }));

            const { data: newOrder } = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
              { items, shippingAddress: shipping, status: "Paid" },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            dispatch({ type: "SET_CART", payload: [] });
            navigate("/order-confirmation", {
              state: { orderId: newOrder._id, totalPrice: newOrder.totalPrice },
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

  /* ────────── render ────────── */
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Checkout</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* form */}
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
              placeholder={ph}
              value={shipping[name]}
              onChange={handleChange}
              className="block w-full border p-2 rounded mb-3"
            />
          ))}
        </div>

        {/* summary */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-4">Order Summary</h4>

          <ul className="divide-y">
            {cartItems.map(({ product, quantity }) => (
              <li key={product._id} className="py-2 flex justify-between">
                <span>{product.title} × {quantity}</span>
                <span>₹{priceAfterDisc(product) * quantity}</span>
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
                <span>-₹{couponDisc.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total to Pay</span>
              <span>₹{totalToPay.toLocaleString()}</span>
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
