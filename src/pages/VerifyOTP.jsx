// src/pages/VerifyOTP.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck, Loader2, ArrowLeft } from "lucide-react";

import { useToast } from "../components/ui/Toast";
import AuthLayout from "../components/ui/AuthLayout";
import OtpInput from "../components/ui/OtpInput";
import { EASE, spring } from "../components/ui/motion";

const RESEND_SECONDS = 45;

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const email = location.state?.email;

  /* countdown before the "resend" hint becomes actionable */
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Enter all six digits.");
      return;
    }

    setVerifying(true);
    try {
      const res = await axios.post(
        "https://furnicasa.onrender.com/api/auth/verify-otp",
        { email, otp }
      );
      toast.success(res.data.message || "Email verified — you can log in now.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "That code didn't work.");
      setOtp("");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AuthLayout
      title="Check your inbox"
      subtitle={
        email ? (
          <>
            We sent a six-digit code to{" "}
            <span className="font-semibold text-ink-800">{email}</span>.
          </>
        ) : (
          "Enter the six-digit code we emailed you."
        )
      }
      footer={
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
        >
          <ArrowLeft size={15} />
          Back to login
        </Link>
      }
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="mx-auto mb-9 flex h-16 w-16 items-center justify-center rounded-2xl bg-clay-grad text-white shadow-glow"
      >
        <MailCheck size={28} strokeWidth={1.8} />
      </motion.div>

      <form onSubmit={handleVerify} className="space-y-7">
        <OtpInput value={otp} onChange={setOtp} />

        <motion.button
          type="submit"
          disabled={verifying || otp.length < 6}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
          className="btn-primary btn-sheen w-full"
        >
          {verifying ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Verifying…
            </>
          ) : (
            "Verify code"
          )}
        </motion.button>
      </form>

      <p className="mt-7 text-center text-sm text-ink-500">
        {seconds > 0 ? (
          <>
            Didn't get it? You can request a new code in{" "}
            <span className="font-semibold tabular-nums text-ink-800">
              {seconds}s
            </span>
          </>
        ) : (
          <>
            Still nothing? Check your spam folder, or{" "}
            <Link
              to="/register-advanced"
              className="font-semibold text-clay-600 hover:underline"
            >
              sign up again
            </Link>{" "}
            to resend.
          </>
        )}
      </p>
    </AuthLayout>
  );
}
