// src/components/Field.jsx
import React, { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Labelled text input used across the auth forms. Password fields get a
 * show/hide toggle so people can check what they typed.
 */
export default function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  hint,
}) {
  const id = useId();
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && reveal ? "text" : type;

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`input ${isPassword ? "pr-12" : ""}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-sand-100 hover:text-ink-700"
          >
            {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {hint && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
