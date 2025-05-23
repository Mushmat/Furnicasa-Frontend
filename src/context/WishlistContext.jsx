/*  src/context/WishlistContext.jsx
    ────────────────────────────────────────────────────────────────────
    Global “wishlist” state (logged-in users only)
*/
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import axios from "axios";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

/* ------------------------------------------------------------------ */
/* reducer – a tiny state machine                                     */
/* ------------------------------------------------------------------ */
const reducer = (state, action) => {
  switch (action.type) {
    case "SET":    return action.payload;                         // replace all
    case "ADD":    return [...state, action.payload];             // push one
    case "REMOVE": return state.filter((i) => i._id !== action.payload);
    default:       return state;
  }
};

/* ------------------------------------------------------------------ */
/* provider                                                           */
/* ------------------------------------------------------------------ */
export const WishlistProvider = ({ children }) => {
  const [items, dispatch] = useReducer(reducer, []);

  /* ---------- helpers (all require a valid JWT) ------------------ */
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  /* ---------- ADD ------------------------------------------------ */
  const add = async (product) => {
    if (!localStorage.getItem("token")) {
      alert("Please log in to use the wishlist.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add`,
        { productId: product._id },
        { headers: headers() }
      );
      /* data.item = { _id, user, product } */
      dispatch({ type: "ADD", payload: data.item });
    } catch (err) {
      console.error(err);
      alert("Could not update wishlist");
    }
  };

  /* ---------- REMOVE -------------------------------------------- */
  const remove = async (wishlistId) => {
    if (!localStorage.getItem("token")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${wishlistId}`,
        { headers: headers() }
      );
      dispatch({ type: "REMOVE", payload: wishlistId });
    } catch (err) {
      console.error(err);
      alert("Could not update wishlist");
    }
  };

  /* ---------- initial fetch when app mounts --------------------- */
  useEffect(() => {
    (async () => {
      if (!localStorage.getItem("token")) return;        // guest → skip
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
          { headers: headers() }
        );
        /* backend returns [{ _id, product, … }] */
        dispatch({ type: "SET", payload: data });
      } catch (err) {
        console.error("Wishlist fetch failed:", err);
      }
    })();
  }, []);

  /* ---------- context value ------------------------------------- */
  return (
    <WishlistContext.Provider value={{ items, add, remove }}>
      {children}
    </WishlistContext.Provider>
  );
};
