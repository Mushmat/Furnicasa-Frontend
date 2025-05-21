// src/context/CartContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

/* ────────────── initial state ────────────── */
const initialState = {
  cartItems: [], // [{ product, quantity }, …]
};

/* ────────────── reducer ────────────── */
const reducer = (state, action) => {
  switch (action.type) {
    /* ① full replacement (authoritative copy from server) */
    case "SET_CART":
      return { ...state, cartItems: action.payload };

    /* ② optimistic/guest add (used when no token) */
    case "ADD":
    case "ADD_TO_CART":
      return { ...state, cartItems: [...state.cartItems, action.payload] };

    /* ③ optional local remove */
    case "REMOVE_FROM_CART":
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

/* ────────────── provider ────────────── */
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* pulls the latest cart from the API and stores it in context */
  const syncWithServer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // guest session → nothing to sync
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // server may send { items: [...] } OR plain array
      const items = Array.isArray(res.data)
        ? res.data
        : res.data.items || [];

      dispatch({ type: "SET_CART", payload: items });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  /* run once on mount (if user already logged in) */
  useEffect(() => {
    syncWithServer();
  }, []);

  /* derived data you might find handy elsewhere */
  const itemCount = state.cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        itemCount,
        dispatch,
        syncWithServer, // expose manual refresh if needed
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
