// src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If you do NOT have a proxy in vite.config.js:
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      // If you HAVE a proxy set up, you can use:
      // const res = await axios.post("/api/auth/register", { name, email, password });

      const token = res.data.token;

      // After successful register, log them in automatically
      login(email, token);

      // Redirect to home page
      navigate("/");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Full Name"
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
            placeholder="you@example.com"
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
            placeholder="Create a password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors"
        >
          Register
        </button>

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

export default Register;
