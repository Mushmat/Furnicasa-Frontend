// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const nav = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const email = state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
        { email, otp, newPassword }
      );
      toast.success("Password reset! Please log in.");
      nav("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid code or expired.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
        <p className="mb-4 text-sm">Email: <b>{email}</b></p>

        <label className="block text-sm font-medium mb-1">OTP Code</label>
        <input
          type="text"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-6"
        />

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
