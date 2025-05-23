import {
  createContext,
  useContext,
  useReducer,
  useEffect
} from "react";
import axios from "axios";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

/* ------------------------------------------------------------------ */
/* reducer                                                             */
/* ------------------------------------------------------------------ */
const reducer = (state, action) => {
  switch (action.type) {
    case "SET":       return action.payload;                    // replace all
    case "ADD":       return [...state, action.payload];        // push one
    case "REMOVE":    return state.filter(i => i._id !== action.payload);
    default:          return state;
  }
};

/* ------------------------------------------------------------------ */
/* provider                                                            */
/* ------------------------------------------------------------------ */
export const WishlistProvider = ({ children }) => {
  const [items, dispatch] = useReducer(reducer, []);

  /* -------- add --------------------------------------------------- */
  const add = async (product) => {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add`,
      { productId: product._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // data.item = { _id, user, product }
    dispatch({ type: "ADD", payload: data.item });
  };

  /* -------- remove ------------------------------------------------ */
  const remove = async (wishlistId) => {
    const token = localStorage.getItem("token");
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${wishlistId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch({ type: "REMOVE", payload: wishlistId });
  };

  /* -------- initial fetch once user is logged in ------------------ */
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // backend already returns [{ _id, product, … }]
        dispatch({ type: "SET", payload: data });
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
