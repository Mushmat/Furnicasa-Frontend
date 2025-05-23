// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LoadingProvider } from "./context/LoadingContext.jsx";   // ⬅️ NEW
import { WishlistProvider } from "./context/WishlistContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>       {/* ⬅️ outermost so every axios call is tracked */}
      <CartProvider>
        <AuthProvider>
          <WishlistProvider>
          <App />
          </WishlistProvider>
        </AuthProvider>
      </CartProvider>
    </LoadingProvider>
  </StrictMode>
);
