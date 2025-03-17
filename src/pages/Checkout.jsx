import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cartItems } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout Summary</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.product._id}>
            {item.product.title} - Qty: {item.quantity} - Price: ₹{item.product.price}
          </li>
        ))}
      </ul>

      <div className="mt-4 border p-4 rounded shadow">
        <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>
      </div>
    </div>
  );
};

export default Checkout;
