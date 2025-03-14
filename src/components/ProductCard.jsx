import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
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
