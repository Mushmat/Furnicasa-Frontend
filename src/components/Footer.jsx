// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const LINKS = [
  { label: "About Us", to: "/about" },
  { label: "FAQs", to: "/faqs" },
  { label: "Policies", to: "/policies" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Contact Us", to: "/contact" },
];

export default function Footer() {
  return (
    <footer>
      {/* Quick-links grid */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-gray-700 hover:text-orange-600"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* main footer bar */}
      <div className="bg-gray-900 text-gray-400 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          © {new Date().getFullYear()} Furnicasa. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
