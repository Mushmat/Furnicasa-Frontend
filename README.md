# Furnicasa - Front-End

> **Live Demo:** <https://furnicasa-frontend.vercel.app>  
> **Status:** ![production-badge](https://img.shields.io/badge/live-✅-brightgreen) ![vercel](https://img.shields.io/badge/hosted%20on-vercel-black)  
> **License:** View-only & All Rights Reserved (see [`LICENSE`](./LICENSE))

Welcome to the **Furnicasa** front-end repository—the React/Vite codebase that powers a blazing-fast, PWA-ready furniture e-commerce site.  
This project was built end-to-end during my SDE internship, covering **UI, state management, routing, payments, and production deployment**. Feel free to explore the code; every line is meant to be educational and production-grade.

---

## ✨ Features

| Area | Highlights |
|------|------------|
| **Modern UI** | Tailwind CSS + Headless UI, responsive grid, dark-mode ready |
| **Routing & State** | React Router v6, Context API + hooks, persistent cart |
| **Product Catalogue** | Pagination, search by keyword, category filters, 5-star reviews |
| **Secure Auth** | JWT flow (login/OTP handled by back-end) with public/private routes |
| **Checkout** | Razorpay live integration, dynamic order summary, shipping form with PIN lookup |
| **Admin Panel** | Order management (update status, delete order), inventory hooks, analytics placeholders |
| **Performance** | Vite code-splitting, lazy-loaded images (Cloudinary), < 50 KB first load |
| **PWA** | Service-worker caching, install prompt, offline toast |
| **CI/CD** | GitHub Actions → Vercel preview → Production promote |

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| **Framework** | React 18 + Vite 5 |
| **Styling** | Tailwind CSS, @headlessui/react, Heroicons |
| **State & Utils** | Context API, React Query (orders), Axios |
| **Forms** | React Hook Form, Yup validation |
| **Payments** | Razorpay Checkout.js (live) |
| **Tooling** | ESLint + Prettier, Husky pre-commit hooks |
| **Hosting** | Vercel (front-end), Render (API) |
| **Monitoring** | Vercel Analytics, LogRocket (disabled in demo) |

---

## 🗂️ Folder Structure
```
src/
├── assets/         # Static images & icons
├── components/     # Reusable UI primitives
├── pages/          # Route-level views
├── context/        # Global providers (Auth, Cart, Toast)
├── services/       # API helpers (Axios instances)
├── data/           # Data Models
├── App.css
├── App.jsx
├── index.css 
└── main.jsx        # App entry
```

**Check the live demo:** [https://furnicasa-frontend.vercel.app](https://furnicasa-frontend.vercel.app)

## 🤝 Acknowledgements
- **Furnicasa** leadership for guidance, UI feedback, and production testing  
- **Tailwind Labs** & **Headless UI** for stellar styling utilities  
- **Razorpay** for their developer-friendly payment APIs  
- The open-source community whose tools and docs made this build possible

## 📜 License
This repository is **source-available, view-only**.  
All rights are reserved; copying, modification, or redistribution is prohibited without written permission.  
See the full terms in [`LICENSE`](./LICENSE).
