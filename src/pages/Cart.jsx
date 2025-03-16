import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { FiTrash2 } from "react-icons/fi";

const Cart = () => {
  const { cartItems, dispatch } = useCart();
  const [backendCart, setBackendCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://furnicasa.onrender.com/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBackendCart(res.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://furnicasa.onrender.com/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBackendCart(backendCart.filter(item => item.product._id !== productId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {backendCart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        backendCart.map((item) => (
          <div key={item.product._id} className="border p-4 rounded shadow flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src={item.product.imageUrl} alt={item.product.title} className="h-16 w-16 object-contain" />
              <div>
                <h3 className="font-bold">{item.product.title}</h3>
                <p>{item.product.price} ₹</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span>Qty: {item.quantity}</span>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
