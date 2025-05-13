import React from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const addToCart = async () => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return navigate('/login');
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: 'SET_CART', payload: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="single-grid-product bg-white rounded shadow hover:shadow-lg overflow-hidden">
      <div className="product-image relative group">
        {/* Labels */}
        {product.onSale && (
          <span className="absolute top-2 left-2 bg-red-600 text-xs text-white px-2 py-1 rounded">Sale</span>
        )}
        {!product.onSale && product.isNew && (
          <span className="absolute top-2 left-2 bg-green-600 text-xs text-white px-2 py-1 rounded">New</span>
        )}

        {/* Two-state image */}
        <a href={`/product/${product._id}`} className="block">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </a>

        {/* Hover actions */}
        <div className="product-action absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4">
          <button onClick={addToCart} className="text-white hover:text-orange-400">
            <i className="fa fa-cart-plus fa-lg"></i>
          </button>
          <button className="text-white hover:text-orange-400">
            <i className="fa fa-eye fa-lg"></i>
          </button>
          <button className="text-white hover:text-orange-400">
            <i className="fa fa-heart-o fa-lg"></i>
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="title text-lg font-semibold mb-2">
          <a href={`/product/${product._id}`} className="hover:text-orange-600">
            {product.name}
          </a>
        </h3>

        <p className="product-price mb-1">
          <span className="discounted-price text-red-500 mr-2">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="main-price line-through text-gray-500">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </p>

        <button
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
