// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RegisterAdvanced from "./pages/RegisterAdvanced";
import VerifyOTP from "./pages/VerifyOTP";
import LoginRegister from "./pages/LoginRegister";
import Login from "./pages/Login";                // if you still use Login.jsx
import MyAccount from "./pages/MyAccount";
import OrderConfirmation from "./pages/OrderConfirmation";
import Checkout from "./pages/Checkout";
// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminAddProduct from "./pages/AdminAddProduct";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Account */}
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            
            {/* Auth flows */}
            <Route path="/register-advanced" element={<LoginRegister />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/login" element={<LoginRegister />} />

            {/* Checkout */}
            <Route path="/checkout" element={<Checkout />} />

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/add-product" element={<AdminAddProduct />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
