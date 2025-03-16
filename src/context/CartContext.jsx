import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const initialState = {
  cartItems: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cartItems: action.payload };

    case "ADD_TO_CART":
      return { ...state, cartItems: [...state.cartItems, action.payload] };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.product._id !== action.payload),
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
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
