// src/components/Field.jsx
import React from "react";

export default function Field({ label, name, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="mt-1 block w-full border-2 border-gray-400 rounded-md focus:border-orange-500 focus:ring-orange-500"
      />
    </div>
  );
}
