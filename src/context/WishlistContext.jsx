import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

const reducer = (state, action) => {
  switch (action.type) {
    case "SET":    return action.payload;
    case "ADD":    return [...state, action.payload];
    case "REMOVE": return state.filter((item) => item._id !== action.payload);
    default:       return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // --- ADD -----------------------------------------------------------
  const add = async (product) => {
    const token  = localStorage.getItem("token");
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add`,
      { productId: product._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    /* data.item === { _id, user, product } thanks to backend */
    setItems((prev) => [...prev, data.item]);
  };

  // --- REMOVE --------------------------------------------------------
  const remove = async (wishlistId) => {
    const token = localStorage.getItem("token");
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${wishlistId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setItems((prev) => prev.filter((it) => it._id !== wishlistId));
  };

  // --- initial load --------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems(data);                 // data is already [{ _id, product, … }]
      } catch (err) {
        console.error("Wishlist fetch failed:", err);
      }
    })();
  }, []);

  return (
    <WishlistContext.Provider value={{ items, add, remove }}>
      {children}
    </WishlistContext.Provider>
  );
};