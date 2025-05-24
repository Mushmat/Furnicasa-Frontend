// src/pages/About.jsx
import { Link } from "react-router-dom";

/* ───────────────────────── helpers & data ───────────────────────── */

const features = [
  {
    icon: "/assets/images/icons/feature-1.png",
    title: "Free home delivery",
    desc: "We provide free home delivery on all orders over ₹10 000.",
  },
  {
    icon: "/assets/images/icons/feature-2.png",
    title: "Quality products",
    desc: "Meticulous materials and craftsmanship, always.",
  },
  {
    icon: "/assets/images/icons/feature-3.png",
    title: "3-day return",
    desc: "Not happy? Return within 3 days for a full refund.",
  },
];

/* one-person “team” (your profile) */
const ME = {
  img: "/assets/images/team/placeholder-dev.jpg", // 🖼️ drop any 400×400 headshot
  name: "Chirayu Choudhary",
  role: "Full-Stack Developer",
  bio: `I’m an Integrated M.Tech (CSE) student at the International
  Institute of Information Technology, Bangalore.  
  This entire website—front & back—was built in-house for my father’s company,
  letting me blend academic learning with real-world product engineering.`,
  links: {
    github: "https://github.com/your-handle",
    linkedin: "https://linkedin.com/in/your-handle",
    mail: "mailto:chirayu@example.com",
  },
};

/* six hard-coded customer reviews */
const reviews = [
  {
    name: "Riya Patel",
    rating: 5,
    comment:
      "Loved the midnight-blue sofa — plush, sturdy and delivered on time!",
  },
  {
    name: "Aakash Verma",
    rating: 4,
    comment:
      "Dining set quality is excellent. Minor scratch on one chair, customer-care handled it quickly.",
  },
  {
    name: "Meera Nair",
    rating: 5,
    comment:
      "Website UI is smooth and the AR preview feature saved me a showroom trip.",
  },
  {
    name: "Kabir Singh",
    rating: 4,
    comment:
      "Got a custom bookshelf made; communication and finish were spot-on.",
  },
  {
    name: "Tanvi Kulkarni",
    rating: 5,
    comment:
      "Three-day return actually works — I exchanged a coffee table hassle-free.",
  },
  {
    name: "Rahul Menon",
    rating: 5,
    comment:
      "Great mix of modern and classic designs at sane prices. Highly recommend Furnicasa.",
  },
];

/* quick stars renderer */
const Stars = ({ n }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`h-4 w-4 ${i < n ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.563-.955L10 .5l2.947 5.455 6.563.955-4.755 4.635 1.123 6.545z" />
      </svg>
    ))}
  </div>
);

/* ───────────────────────── component ───────────────────────── */

export default function About() {
  return (
    <div className="space-y-24">
      {/* ───── Hero banner ───── */}
      <section
        className="h-64 bg-cover bg-center flex items-center"
        style={{ backgroundImage: "url('/assets/images/bg/breadcrumb.png')" }}
      >
        <div className="container mx-auto px-4 text-white">
          <h1 className="text-4xl font-bold">About&nbsp;Us</h1>
          <nav className="mt-2 text-sm">
            <ol className="flex space-x-2">
              <li>
                <Link to="/" className="underline">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>About</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* ───── Company intro ───── */}
      <section className="container mx-auto px-4 grid gap-12 lg:grid-cols-2 items-center">
        <img
          src="/assets/images/blog/blog-6.png"
          alt="About Furnicasa"
          className="w-full rounded shadow"
        />
        <div className="space-y-4">
          <span className="text-orange-600 font-medium">Since 2019</span>
          <h2 className="text-3xl font-semibold">
            Providing quality furniture for modern living
          </h2>
          <p className="text-gray-700">
            At Furnicasa we believe your home should tell the story of who you
            are. That’s why every piece is curated for style, durability and
            value.
          </p>
          <p className="text-gray-700">
            From sleek sofas to handcrafted dining sets, our catalogue elevates
            every corner of your space — minus the showroom mark-up.
          </p>
        </div>
      </section>

      {/* ───── Key features ───── */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white p-6 rounded shadow text-center space-y-4"
            >
              <img src={f.icon} alt="" className="mx-auto h-16" />
              <h4 className="font-semibold">{f.title}</h4>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Customer reviews ───── */}
      <section className="container mx-auto px-4 space-y-8">
        <h2 className="text-3xl font-semibold text-center">What customers say</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded shadow p-6 flex flex-col space-y-4"
            >
              <Stars n={r.rating} />
              <p className="text-gray-700 flex-1 italic">“{r.comment}”</p>
              <p className="font-semibold text-right">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── “Team” (solo) ───── */}
      <section className="container mx-auto px-4 space-y-8">
        <h2 className="text-3xl font-semibold text-center">Our Team</h2>

        <div className="max-w-md mx-auto bg-white rounded shadow overflow-hidden">
          <img
            src={ME.img}
            alt={ME.name}
            className="w-full h-72 object-cover"
          />

          <div className="p-6 space-y-3 text-center">
            <h3 className="text-xl font-semibold">{ME.name}</h3>
            <p className="text-orange-600">{ME.role}</p>
            <p className="text-gray-700 whitespace-pre-line">{ME.bio}</p>

            <div className="flex justify-center space-x-4 pt-2 text-gray-600">
              <a href={ME.links.github}  target="_blank" rel="noreferrer" aria-label="GitHub">
                <i className="fab fa-github text-xl hover:text-gray-800" />
              </a>
              <a href={ME.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin text-xl hover:text-blue-700" />
              </a>
              <a href={ME.links.mail} aria-label="e-mail">
                <i className="fas fa-envelope text-xl hover:text-red-500" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
