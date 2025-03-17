// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RegisterAdvanced from "./pages/RegisterAdvanced";
import VerifyOTP from "./pages/VerifyOTP";
import Login from "./pages/Login";
import AdminOrders from "./pages/AdminOrders";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddProduct from "./pages/AdminAddProduct";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Advanced Auth Routes */}
            <Route path="/register-advanced" element={<RegisterAdvanced />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/login" element={<Login />} />

            {/* Order & Checkout Routes */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />

            {/* Admin Panel Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/add-product" element={<AdminAddProduct />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
