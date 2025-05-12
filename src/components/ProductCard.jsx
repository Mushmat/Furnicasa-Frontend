// src/components/ProductCard.jsx
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const addToCart = async () => {
    // If no user, prompt login
    if (!user) {
      alert("Please log in to add items to your cart.");
      return navigate("/login");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        {
          productId: product._id,
          quantity: 1, // default quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // The backend returns the entire updated cart array
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg h-80 flex flex-col justify-between">
      <img
        src={product.imageUrl}
        alt={product.title || product.name || "Product Image"}
        className="h-48 w-full object-contain p-2"
      />
      <h2 className="text-lg font-bold mt-2">
        {product.title || product.name || "No Name"}
      </h2>
      <p>{product.price} ₹</p>
      <button
        onClick={addToCart}
        className="mt-2 bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;