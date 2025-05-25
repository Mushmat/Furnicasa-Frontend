// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail]             = useState("");
  const [otp, setOtp]                 = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage]         = useState("");
  const [error, setError]             = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
        { email, otp, newPassword }
      );
      setMessage(data.message);
      // optionally redirect to login after a short pause:
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center">Reset Password</h2>

        {message && (
          <div className="text-green-600 text-center">{message}</div>
        )}
        {error && (
          <div className="text-red-600 text-center">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reset Code (OTP)
          </label>
          <input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded-md font-semibold hover:bg-orange-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
