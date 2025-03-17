// src/pages/Cart.jsx
import { useCart } from "../context/CartContext";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";

const Cart = () => {
  const { cartItems, dispatch } = useCart();

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // The backend returns the updated cart array
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Patch route to update quantity
  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update/${productId}`,
        { newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Res returns the full updated cart array
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  // Increment or decrement calls the patch route
  const incrementQuantity = (productId, currentQty) => {
    updateQuantity(productId, currentQty + 1);
  };

  const decrementQuantity = (productId, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return <p className="p-4">Your cart is empty.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cartItems.map((item) => (
        <div
          key={item.product._id}
          className="border p-4 rounded shadow flex justify-between items-center mb-4"
        >
          <div className="flex items-center space-x-4">
            <img
              src={item.product.imageUrl}
              alt={item.product.title}
              className="h-16 w-16 object-contain"
            />
            <div>
              <h3 className="font-bold">{item.product.title}</h3>
              <p>{item.product.price} ₹</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Decrement Button */}
            <button
              onClick={() => decrementQuantity(item.product._id, item.quantity)}
              className="bg-gray-300 px-2 py-1 rounded"
            >
              -
            </button>

            <span>Qty: {item.quantity}</span>

            {/* Increment Button */}
            <button
              onClick={() => incrementQuantity(item.product._id, item.quantity)}
              className="bg-gray-300 px-2 py-1 rounded"
            >
              +
            </button>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.product._id)}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cart;
