// src/pages/LoginRegister.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();

  /* ───── Login state ───── */
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://furnicasa.onrender.com/api/auth/login",
        loginData
      );
      const { token, isAdmin } = res.data;
      login(loginData.email, token, isAdmin);
      navigate(isAdmin ? "/admin" : "/");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  /* ───── Register state ───── */
  const [regData, setRegData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const handleRegChange = (e) =>
    setRegData({ ...regData, [e.target.name]: e.target.value });
  const handleRegSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://furnicasa.onrender.com/api/auth/register",
        regData
      );
      setStatusMessage(res.data.message);
      navigate("/verify-otp", { state: { email: regData.email } });
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  /* ───── JSX ───── */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* ─── breadcrumb banner ─── */}
      <div
        className="w-full max-w-5xl h-48 rounded-lg bg-cover bg-center mb-12"
        style={{ backgroundImage: "url(/assets/images/bg/breadcrumb.png)" }}
      >
        <div className="h-full bg-black/40 flex flex-col justify-center pl-8 rounded-lg">
          <h1 className="text-4xl font-bold text-white">
            Login&nbsp;&amp;&nbsp;Register
          </h1>
          <nav className="text-gray-200 mt-2">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            / Login&nbsp;Register
          </nav>
        </div>
      </div>

      {/* ─── cards wrapper ─── */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ───── LOGIN CARD ───── */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-orange-600 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-md shadow hover:bg-orange-700"
            >
              Log&nbsp;In
            </button>
          </form>
        </div>

        {/* ───── REGISTER CARD ───── */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

          <form onSubmit={handleRegSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full&nbsp;Name
              </label>
              <input
                type="text"
                name="fullName"
                value={regData.fullName}
                onChange={handleRegChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={regData.phone}
                onChange={handleRegChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={regData.email}
                onChange={handleRegChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={regData.password}
                onChange={handleRegChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-md shadow hover:bg-orange-700"
            >
              Register
            </button>

            {statusMessage && (
              <p className="mt-4 text-center text-green-600">{statusMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
