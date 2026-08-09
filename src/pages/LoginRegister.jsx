// src/pages/LoginRegister.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import AuthLayout from "../components/ui/AuthLayout";
import Field from "../components/Field";
import { EASE, spring } from "../components/ui/motion";

const TABS = [
  { key: "login", label: "Log in" },
  { key: "register", label: "Create account" },
];

export default function LoginRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  /* /register-advanced lands straight on the sign-up tab */
  const [tab, setTab] = useState(
    location.pathname === "/register-advanced" ? "register" : "login"
  );

  /* ── login ── */
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const { data } = await axios.post(
        "https://furnicasa.onrender.com/api/auth/login",
        loginData
      );
      login(loginData.email, data.token, data.isAdmin);
      toast.success("Welcome back");
      navigate(data.isAdmin ? "/admin" : location.state?.from || "/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed. Check your details.");
    } finally {
      setLoggingIn(false);
    }
  };

  /* ── register ── */
  const [regData, setRegData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [agree, setAgree] = useState(false);
  const [registering, setRegistering] = useState(false);

  const handleRegChange = (e) =>
    setRegData({ ...regData, [e.target.name]: e.target.value });

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    if (!agree) return;
    setRegistering(true);
    try {
      const { data } = await axios.post(
        "https://furnicasa.onrender.com/api/auth/register",
        regData
      );
      toast.success(data.message || "Check your inbox for the code.");
      navigate("/verify-otp", { state: { email: regData.email } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed.");
    } finally {
      setRegistering(false);
    }
  };

  /* ── Google Identity Services ── */
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google || !clientId || !googleBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
            { idToken: response.credential }
          );
          login(data.user?.email || "", data.token, data.isAdmin);
          toast.success("Signed in with Google");
          navigate(data.isAdmin ? "/admin" : "/");
        } catch (e) {
          console.error(e);
          toast.error("Google login failed, please try again.");
        }
      },
      auto_select: false,
      ux_mode: "popup",
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      type: "standard",
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left",
      width: 360,
    });
    // re-rendered when the visible tab changes so the button never sits hidden
  }, [tab]);

  const isLogin = tab === "login";

  return (
    <AuthLayout
      title={isLogin ? "Welcome back" : "Create your account"}
      subtitle={
        isLogin
          ? "Sign in to track orders, save favourites and check out faster."
          : "One account for orders, wishlists and delivery tracking."
      }
      footer={
        <p className="text-center text-sm text-ink-500">
          {isLogin ? "New to Furnicasa? " : "Already have an account? "}
          <button
            onClick={() => setTab(isLogin ? "register" : "login")}
            className="font-semibold text-clay-600 hover:underline"
          >
            {isLogin ? "Create an account" : "Log in instead"}
          </button>
        </p>
      }
    >
      {/* tab switcher */}
      <div className="mb-8 flex rounded-full bg-ink-900/[.06] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.key ? "text-sand-50" : "text-ink-600 hover:text-ink-900"
            }`}
          >
            {tab === t.key && (
              <motion.span
                layoutId="auth-tab"
                transition={spring}
                className="absolute inset-0 rounded-full bg-ink-900 shadow-lift"
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.form
            key="login"
            onSubmit={handleLoginSubmit}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="space-y-5"
          >
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={loginData.email}
              onChange={handleLoginChange}
            />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={loginData.password}
              onChange={handleLoginChange}
            />

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-600">
                <input type="checkbox" className="checkbox" />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-clay-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="btn-primary btn-sheen w-full"
            >
              {loggingIn ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="register"
            onSubmit={handleRegSubmit}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="space-y-5"
          >
            <Field
              label="Full name"
              name="fullName"
              autoComplete="name"
              value={regData.fullName}
              onChange={handleRegChange}
            />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={regData.phone}
              onChange={handleRegChange}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={regData.email}
              onChange={handleRegChange}
            />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={regData.password}
              onChange={handleRegChange}
              hint="We'll email you a 6-digit code to confirm your address."
            />

            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-600">
              <input
                type="checkbox"
                className="checkbox mt-0.5"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <Link to="/terms" className="font-semibold text-clay-600 hover:underline">
                  terms &amp; conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="font-semibold text-clay-600 hover:underline">
                  privacy policy
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={!agree || registering}
              className="btn-primary btn-sheen w-full"
            >
              {registering ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* divider + Google */}
      <div className="my-7 flex items-center gap-4">
        <span className="hairline" />
        <span className="shrink-0 text-xs uppercase tracking-widest text-ink-400">
          or
        </span>
        <span className="hairline" />
      </div>

      <div id="gsi-slot" ref={googleBtnRef} className="flex min-h-[44px] justify-center" />
    </AuthLayout>
  );
}
