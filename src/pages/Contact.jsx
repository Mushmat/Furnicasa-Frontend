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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: actually submit
    alert("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="space-y-16">
      {/* Hero / Breadcrumb */}
      <section
        className="h-64 bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url('/assets/images/bg/breadcrumb.png')",
        }}
      >
        <div className="container mx-auto px-4 text-white">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <nav className="mt-2 text-sm">
            <ol className="flex space-x-2">
              <li>
                <Link to="/" className="underline">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>Contact</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="container mx-auto px-4 grid gap-8 lg:grid-cols-2">
        {/* Left: Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <p className="text-gray-700">
            We’d love to hear from you! Reach out via the form or through any of
            the methods below.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Email:</strong> support@furnicasa.com
            </li>
            <li>
              <strong>Phone:</strong> +91 98765 43210
            </li>
            <li>
              <strong>Address:</strong> 123 Furniture Lane, Delhi, India
            </li>
          </ul>
        </div>

        {/* Right: Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-lg space-y-4"
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
            className="mt-2 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
          >
            Send Message
          </button>
        </form>
      </section>

    
    </div>
  );
}

//Final Contact.jsx
