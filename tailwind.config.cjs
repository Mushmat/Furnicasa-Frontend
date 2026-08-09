/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },

      colors: {
        /* deep neutral used for dark sections, text and shadows */
        ink: {
          50: "#F7F6F4",
          100: "#EDEAE5",
          200: "#D8D2C9",
          300: "#B8AFA2",
          400: "#8E8375",
          500: "#6B6154",
          600: "#4F4740",
          700: "#3A342F",
          800: "#272320",
          900: "#181513",
          950: "#0D0B0A",
        },
        /* warm terracotta — evolved from the old orange, keeps brand continuity */
        clay: {
          50: "#FEF5F0",
          100: "#FDE7DA",
          200: "#FACBB2",
          300: "#F5A57F",
          400: "#EE7C4C",
          500: "#E35B28",
          600: "#C9421A",
          700: "#A53118",
          800: "#84291A",
          900: "#6B2418",
          950: "#3A0F09",
        },
        /* cream canvas */
        sand: {
          50: "#FDFCFA",
          100: "#F8F5EF",
          200: "#F0EADF",
          300: "#E4DACA",
          400: "#D2C3AC",
          500: "#BCA88B",
          600: "#A08A6C",
          700: "#836F56",
          800: "#6B5B49",
          900: "#584C3E",
        },
        /* muted forest — secondary accent for trust / success */
        jade: {
          50: "#F1F7F4",
          100: "#DCEBE3",
          200: "#BAD7C9",
          300: "#8DBBA6",
          400: "#5D9A80",
          500: "#3E7D64",
          600: "#2E644F",
          700: "#265041",
          800: "#204036",
          900: "#1C362E",
        },
        gold: {
          400: "#E0B25C",
          500: "#CE9A3D",
          600: "#AC7B2B",
        },
      },

      boxShadow: {
        soft: "0 1px 2px rgba(24,21,19,.04), 0 4px 12px -2px rgba(24,21,19,.06)",
        card: "0 2px 4px rgba(24,21,19,.04), 0 12px 28px -8px rgba(24,21,19,.10)",
        lift: "0 8px 16px rgba(24,21,19,.06), 0 28px 56px -16px rgba(24,21,19,.20)",
        float: "0 24px 60px -20px rgba(24,21,19,.32)",
        glow: "0 0 0 1px rgba(227,91,40,.18), 0 12px 40px -12px rgba(227,91,40,.45)",
        inset: "inset 0 1px 0 rgba(255,255,255,.65)",
        ring: "0 0 0 1px rgba(24,21,19,.06)",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },

      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        "sheen": "linear-gradient(110deg, transparent 25%, rgba(255,255,255,.55) 48%, transparent 70%)",
        "clay-grad": "linear-gradient(135deg,#EE7C4C 0%,#E35B28 45%,#A53118 100%)",
        "ink-grad": "linear-gradient(135deg,#272320 0%,#0D0B0A 100%)",
      },

      transitionTimingFunction: {
        spring: "cubic-bezier(.22,1,.36,1)",
        "out-expo": "cubic-bezier(.16,1,.3,1)",
        "back-out": "cubic-bezier(.34,1.56,.64,1)",
      },

      keyframes: {
        float: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-14px,0)" },
        },
        "float-slow": {
          "0%,100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
          "33%": { transform: "translate3d(10px,-18px,0) rotate(2deg)" },
          "66%": { transform: "translate3d(-8px,-8px,0) rotate(-2deg)" },
        },
        drift: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(6%,-8%) scale(1.08)" },
          "66%": { transform: "translate(-7%,5%) scale(.95)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pan-gradient": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        pop: {
          "0%": { transform: "scale(.7)", opacity: "0" },
          "60%": { transform: "scale(1.12)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(.85)", opacity: ".7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translate3d(0,24px,0)" },
          to: { opacity: "1", transform: "translate3d(0,0,0)" },
        },
        "skeleton": {
          "0%,100%": { opacity: ".55" },
          "50%": { opacity: "1" },
        },
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 14s ease-in-out infinite",
        drift: "drift 22s ease-in-out infinite",
        shimmer: "shimmer 2.4s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        "pan-gradient": "pan-gradient 12s ease infinite",
        "spin-slow": "spin-slow 26s linear infinite",
        pop: "pop .45s cubic-bezier(.34,1.56,.64,1)",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        "fade-up": "fade-up .7s cubic-bezier(.16,1,.3,1) both",
        skeleton: "skeleton 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
