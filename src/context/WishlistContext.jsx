/*  src/context/WishlistContext.jsx  */
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import axios from "axios";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

/* ---------- reducer ------------------------------------------------ */
const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;                       // replace whole list
    case "ADD":
      return [...state, action.payload];           // push one
    case "REMOVE":
      return state.filter((i) => i._id !== action.payload);
    default:
      return state;
  }
};

/* ---------- provider ----------------------------------------------- */
export const WishlistProvider = ({ children }) => {
  const [items, dispatch] = useReducer(reducer, []);

  /* helper to build auth header */
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  /* ---------- add -------------------------------------------------- */
  const add = async (product) => {
    if (!localStorage.getItem("token"))
      return alert("Please log in to use the wishlist.");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add`,
        { productId: product._id },
        { headers: headers() }
      );
      dispatch({ type: "ADD", payload: data.item });
    } catch (err) {
      console.error(err);
      alert("Could not update wishlist");
    }
  };

  /* ---------- remove ---------------------------------------------- */
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

  /* ---------- initial fetch --------------------------------------- */
  useEffect(() => {
    (async () => {
      if (!localStorage.getItem("token")) return;
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
          { headers: headers() }
        );
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
