// src/context/CartContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const initialState = {
  cartItems: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      // Replace entire cart with the new array
      return { ...state, cartItems: action.payload };

    case "ADD_TO_CART":
      // Not used if we always set the entire array from backend,
      // but we can keep it if needed for single-item additions
      return { ...state, cartItems: [...state.cartItems, action.payload] };

    case "REMOVE_FROM_CART":
      // Removes a single product by ID (if you want local remove)
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.product._id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch cart on initial load if there's a token
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // No user logged in, skip
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
