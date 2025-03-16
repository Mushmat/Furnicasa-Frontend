// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the Auth Context
const AuthContext = createContext();

// Hook for consuming the context in other components
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On initial load, check for existing token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedToken && storedEmail) {
      // If token & email exist, consider user "logged in" in the UI
      setUser({ email: storedEmail, token: storedToken });
    }
  }, []);

  // Login function: store token & user info in state + localStorage
  const login = (email, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    setUser({ email, token });
  };

  // Logout function: clear token & user from localStorage and context
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
