// src/pages/VerifyOTP.jsx
import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Get the email passed from the registration page
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://furnicasa.onrender.com/api/auth/verify-otp", {
        email,
        otp,
      });

      alert(res.data.message);
      // ✅ Redirect to login page upon successful verification
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.error || "OTP Verification Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />

        <button
          onClick={handleVerify}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
