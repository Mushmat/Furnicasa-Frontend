// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { dispatch } = useCart(); // to reset the cart on logout

  // Check for existing token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    const isAdmin = localStorage.getItem("isAdmin") === "true"; // Parse it correctly
    if (storedToken && storedEmail) {
      setUser({ email: storedEmail, token: storedToken, isAdmin });
    }
  }, []);

  // Login: store token & user in state + localStorage
  const login = (email, token, isAdmin) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("isAdmin", isAdmin);
    setUser({ email, token, isAdmin });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin"); // ✅ Clear isAdmin
    setUser(null);
    dispatch({ type: "SET_CART", payload: [] });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
