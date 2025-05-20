import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  /* ------- price helpers ------- */
  const { price, discountPercent = 0 } = product;
  const finalPrice = Math.round(price * (1 - discountPercent / 100));

  const imgSrc =
    Array.isArray(product.images) && product.images.length
      ? product.images[0]
      : product.imageUrl || "/assets/images/placeholder/270x290.png";

  const addToCart = async (e) => {
    /* stop link navigation when clicking “add to cart” */
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      alert("Please log in first.");
      return navigate("/login");
    }

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "SET_CART", payload: data });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="single-grid-product bg-white rounded shadow hover:shadow-lg overflow-hidden">
      <Link to={`/product/${product._id}`} className="block relative group">
        <img
          src={imgSrc}
          alt={product.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />

        <div className="overlay absolute inset-0 flex items-center justify-center text-white text-lg font-semibold">
          View Details
        </div>
      </Link>

      <div className="p-4">
        <h3 className="title text-lg font-semibold mb-2 line-clamp-2">
          <Link to={`/product/${product._id}`} className="hover:text-orange-600">
            {product.title}
          </Link>
        </h3>

        <p className="product-price mb-1">
          {discountPercent > 0 && (
            <span className="line-through text-gray-500 mr-2">
              ₹{price.toLocaleString()}
            </span>
          )}
          <span className="text-red-500 font-semibold">
            ₹{finalPrice.toLocaleString()}
          </span>
          {discountPercent > 0 && (
            <span className="ml-1 text-green-600 text-sm">
              -{discountPercent}%
            </span>
          )}
        </p>

        <button
          type="button"
          onClick={addToCart}
          className="mt-2 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
