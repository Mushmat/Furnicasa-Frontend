// src/pages/Contact.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // ← make this async
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Network response was not ok");
      alert("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      alert("Sorry, failed to send. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero / Breadcrumb */}
<section
  className="relative h-64 bg-cover bg-center"
  style={{
    backgroundImage: "url('/assets/images/bg/breadcrumb.png')",
  }}
>
  {/* dark overlay */}
  <div className="absolute inset-0 bg-black/40" />

  {/* centered content */}
  <div className="absolute inset-0 flex items-center justify-center px-4">
    <div className="text-center text-white">
      <h1 className="text-4xl font-bold drop-shadow-lg mb-2">
        Contact Us
      </h1>
      <nav className="mt-2 text-sm opacity-90">
        <ol className="flex justify-center space-x-2">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>Contact</li>
        </ol>
      </nav>
    </div>
  </div>
</section>


      {/* Centered Content */}
      <section className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="grid gap-12 w-full max-w-4xl lg:grid-cols-2">
          {/* Left: Info */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <p className="text-gray-700">
              We’d love to hear from you! Reach out via the form or through any
              of the methods below.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Email:</strong> cc.furnicasa@gmail.com
              </li>
              <li>
                <strong>Phone:</strong> +91 80582 65231
              </li>
              <li>
                <strong>Address:</strong> C-193, Riico Residential Colony, Sitapura, Jaipur, Rajasthan-302022
              </li>
            </ul>
          </div>

          {/* Right: Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-lg space-y-6"
          >
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-orange-300"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-orange-300"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-orange-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
