// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, Loader2, ArrowLeft } from "lucide-react";

import { useToast } from "../components/ui/Toast";
import AuthLayout from "../components/ui/AuthLayout";
import Field from "../components/Field";
import { spring } from "../components/ui/motion";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
        { email }
      );
      toast.success(data.message || "Check your email for a reset code.");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send the reset code.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter the email on your account and we'll send a six-digit reset code."
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
        <KeyRound size={26} strokeWidth={1.8} />
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

        <button
          type="submit"
          disabled={sending}
          className="btn-primary btn-sheen w-full"
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Sending…
            </>
          ) : (
            "Send reset code"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink-400">
        Already have a code?{" "}
        <Link
          to="/reset-password"
          className="font-semibold text-clay-600 hover:underline"
        >
          Reset your password
        </Link>
      </p>
    </AuthLayout>
  );
}
