// src/pages/Checkout.jsx
import axios from "axios";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cartItems, dispatch } = useCart();
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      // 1️⃣ Create Razorpay Order
      const { data: razorpayOrder } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create`,
        { amount: totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2️⃣ Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Furnicasa",
        description: "Furniture Purchase",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // 3️⃣ Verify Payment Signature
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
              { ...response },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // 4️⃣ Create Order in DB with status "Paid"
            const items = cartItems.map((item) => ({
              productId: item.product._id,
              quantity: item.quantity,
              price: item.product.price,
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

            // 5️⃣ Clear cart and redirect to confirmation page
            dispatch({ type: "SET_CART", payload: [] });

            navigate("/order-confirmation", {
              state: { orderId: newOrder._id, totalPrice: newOrder.totalPrice },
            });
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed.");
          }
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="mb-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={shipping.fullName}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shipping.address}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shipping.city}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shipping.postalCode}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shipping.country}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={shipping.phone}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-2"
        />
      </div>

      <div className="border p-4 rounded shadow mb-4">
        <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>
      </div>

      <button
        onClick={handlePayment}
        className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
      >
        Proceed to Pay
      </button>
    </div>
  );
};

export default Checkout;
