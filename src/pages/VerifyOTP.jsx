// src/pages/VerifyOTP.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual backend URL
      const res = await axios.post("https://your-render-backend.onrender.com/api/auth/verify-otp", {
        email,
        otp,
      });
      setStatusMessage(res.data.message);
      // Optionally, navigate to login automatically
      // navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">OTP</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors"
        >
          Verify
        </button>

        {statusMessage && (
          <p className="mt-4 text-center text-green-600">{statusMessage}</p>
        )}
      </form>
    </div>
  );
};

export default VerifyOTP;
