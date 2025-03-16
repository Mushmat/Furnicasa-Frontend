import { useCart } from '../context/CartContext';
import axios from 'axios';

const Cart = () => {
  const { cartItems, dispatch } = useCart();

  const removeFromCart = async (productId) => {
    await axios.delete(`/api/cart/remove/${productId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.product._id} className="border p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3>{item.product.title}</h3>
                <p>Quantity: {item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
