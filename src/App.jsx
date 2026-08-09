import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingOverlay from "./components/LoadingOverlay";

import { ToastProvider } from "./components/ui/Toast";
import {
  AmbientBackground,
  BackToTop,
  ScrollProgress,
  ScrollToTop,
} from "./components/ui/Chrome";
import { pageTransition } from "./components/ui/motion";

/* Pages */
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import VerifyOTP from "./pages/VerifyOTP";
import LoginRegister from "./pages/LoginRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyAccount from "./pages/MyAccount";
import OrderConfirmation from "./pages/OrderConfirmation";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Terms from "./pages/Terms";
import FAQs from "./pages/FAQs";
import Policies from "./pages/Policies";
import Privacy from "./pages/Privacy";
import CertificateSingle from "./pages/CertificateSingle";
import PdfViewer from "./pages/PdfViewer";

/* Admin */
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProductList from "./pages/AdminProductList";
import AdminProductForm from "./pages/AdminProductForm";
import AdminContacts from "./pages/AdminContacts";

/* Each route fades/slides as a unit so navigation feels continuous
   instead of a hard repaint. */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} {...pageTransition}>
        <Routes location={location}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/certificate/:certId" element={<CertificateSingle />} />

          {/* Account */}
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          {/* Auth flows */}
          <Route path="/register-advanced" element={<LoginRegister />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<LoginRegister />} />

          {/* Legal / info */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/company_profile" element={<PdfViewer />} />

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProductList />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <ScrollProgress />
          <AmbientBackground />

          <div className="relative flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-grow">
              <AnimatedRoutes />
            </main>

            <Footer />
          </div>

          <BackToTop />
        </Router>

        {/* full-screen spinner shown whenever any axios request is in flight */}
        <LoadingOverlay />
      </ToastProvider>
    </MotionConfig>
  );
}
