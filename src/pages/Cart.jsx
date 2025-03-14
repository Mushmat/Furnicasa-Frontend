import { useCart } from '../context/CartContext';
import { FiTrash2 } from "react-icons/fi";

const Cart = () => {
  const { cartItems, dispatch } = useCart();

  const increaseQty = (id) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: id });
  };

  const decreaseQty = (id) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: id });
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="border p-4 rounded shadow flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.name} className="h-16 w-16 object-contain" />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p>{item.price} ₹</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => decreaseQty(item._id)}
                  className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item._id)}
                  className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                >
                  +
                </button>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                >
                  <FiTrash2 />
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
