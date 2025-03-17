import { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";

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

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    const token = localStorage.getItem("token");

    try {
      const items = cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        { items, shippingAddress: shipping },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch({ type: "SET_CART", payload: [] }); // Clear cart
      alert(`Order placed successfully! Order ID: ${res.data._id}`);
    } catch (error) {
      console.error("Order placement failed:", error);
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
        onClick={handleOrder}
        className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
