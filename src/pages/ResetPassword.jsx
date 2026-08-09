// src/pages/ResetPassword.jsx
import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";

import { useToast } from "../components/ui/Toast";
import AuthLayout from "../components/ui/AuthLayout";
import OtpInput from "../components/ui/OtpInput";
import Field from "../components/Field";
import { EASE, spring } from "../components/ui/motion";

/* rough strength read-out — purely a hint, the server still rules */
const scorePassword = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
};

const STRENGTH = [
  { label: "Too short", color: "bg-clay-600", width: "20%" },
  { label: "Weak", color: "bg-clay-500", width: "40%" },
  { label: "Fair", color: "bg-gold-400", width: "60%" },
  { label: "Good", color: "bg-jade-400", width: "80%" },
  { label: "Strong", color: "bg-jade-500", width: "100%" },
];

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  /* ForgotPassword hands the email over so it doesn't need retyping */
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const strength = useMemo(() => scorePassword(newPassword), [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Enter the full six-digit code.");
      return;
    }

    setSaving(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
        { email, otp, newPassword }
      );
      toast.success(data.message || "Password updated — signing you in.");
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset the password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Enter the code we emailed you, then choose a new password."
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
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-900 text-sand-50 shadow-lift"
      >
        <ShieldCheck size={26} strokeWidth={1.8} />
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <span className="label">Reset code</span>
          <OtpInput value={otp} onChange={setOtp} autoFocus={false} />
        </div>

        <div>
          <Field
            label="New password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {newPassword && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-3"
            >
              <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                <motion.div
                  animate={{ width: STRENGTH[strength].width }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className={`h-full rounded-full ${STRENGTH[strength].color}`}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-500">
                Password strength:{" "}
                <span className="font-semibold text-ink-800">
                  {STRENGTH[strength].label}
                </span>
              </p>
            </motion.div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary btn-sheen w-full"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Updating…
            </>
          ) : (
            "Reset password"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
