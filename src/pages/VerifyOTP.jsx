// src/pages/VerifyOTP.jsx
import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp]   = useState("");
  const location        = useLocation();
  const navigate        = useNavigate();

  // Email passed from the registration page
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://furnicasa.onrender.com/api/auth/verify-otp",
        { email, otp }
      );
      alert(res.data.message);
      navigate("/login");           // go to login on success
    } catch (error) {
      alert(error.response?.data?.error || "OTP Verification Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-slate-200 p-8">
        {/* header */}
        <h1 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight">
          Verify&nbsp;OTP
        </h1>
        {email && (
          <p className="mt-1 mb-6 text-center text-sm text-slate-600">
            We emailed a code to&nbsp;
            <span className="font-medium">{email}</span>
          </p>
        )}

        {/* form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center tracking-widest placeholder-slate-400 font-mono text-xl border border-slate-300 rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-700 active:scale-95 transition-transform text-white font-semibold shadow-sm"
          >
            Verify&nbsp;Code
          </button>
        </form>

        {/* resend hint */}
        <p className="mt-6 text-xs text-center text-slate-500">
          Didn’t receive the code? Check your spam folder or try resending from
          the sign-up page.
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
