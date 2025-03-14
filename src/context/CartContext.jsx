import { createContext, useContext, useReducer } from 'react';

// Initial State
const initialState = {
  cartItems: [],
};

// Reducer for handling cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.cartItems.find(item => item._id === action.payload._id);
      if (existingItem) {
        // Increase quantity if item already exists
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        // Add new item with quantity = 1
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
        };
      }

    case "INCREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item._id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item._id === action.payload
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        ),
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item._id !== action.payload),
      };

    default:
      return state;
  }
};

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ cartItems: state.cartItems, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
