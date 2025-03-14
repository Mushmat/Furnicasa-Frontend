import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext'; // ✅ Importing CartProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider> {/* ✅ Wrapping App with CartProvider */}
      <App />
    </CartProvider>
  </StrictMode>,
);
