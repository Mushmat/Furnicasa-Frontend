// src/pages/RegisterAdvanced.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterAdvanced = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual backend URL or environment variable
      const res = await axios.post("https://your-render-backend.onrender.com/api/auth/register", {
        fullName,
        phone,
        email,
        password,
      });
      setStatusMessage(res.data.message);
      // Optionally, navigate to verify page:
      // navigate("/verify-otp");
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register (with OTP)</h2>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Phone</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

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
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors"
        >
          Register
        </button>

        {statusMessage && (
          <p className="mt-4 text-center text-green-600">{statusMessage}</p>
        )}

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterAdvanced;
