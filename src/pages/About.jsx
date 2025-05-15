// src/pages/About.jsx
import { Link } from "react-router-dom";

const features = [
  {
    icon: "/assets/images/icons/feature-1.png",
    title: "Free home delivery",
    desc: "We provide free home delivery on all orders over ₹10,000.",
  },
  {
    icon: "/assets/images/icons/feature-2.png",
    title: "Quality Products",
    desc: "We ensure top-notch materials and craftsmanship.",
  },
  {
    icon: "/assets/images/icons/feature-3.png",
    title: "3 Days Return",
    desc: "Not happy? Return within 3 days for a full refund.",
  },
];

const team = [
  { img: "/assets/images/team/team-1.jpg", name: "Marcos Alonso" },
  { img: "/assets/images/team/team-2.jpg", name: "Isaac Newton" },
  { img: "/assets/images/team/team-3.jpg", name: "Charlotte Taylor" },
];

const testimonials = [
  {
    img: "/assets/images/testimonial/testimonial-2.png",
    authorImg: "/assets/images/author/author-1.png",
    author: "Zeniyea Henderson",
    role: "CTO & Co-Founder, Axels",
    quote:
      "I’m thrilled with my Furnicasa purchase—excellent quality and super stylish!",
  },
  {
    img: "/assets/images/testimonial/testimonial-1.png",
    authorImg: "/assets/images/author/author-1.png",
    author: "Alex Tuntuni",
    role: "Product Designer",
    quote:
      "The modern designs and customer service are top-notch. Highly recommend!",
  },
];

export default function About() {
  return (
    <div className="space-y-24">
      {/* Hero banner */}
      <section
        className="h-64 bg-cover bg-center flex items-center"
        style={{
          backgroundImage: "url('/assets/images/bg/breadcrumb.png')",
        }}
      >
        <div className="container mx-auto px-4 text-white">
          <h1 className="text-4xl font-bold">About Us</h1>
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

      {/* About Us split */}
      <section className="container mx-auto px-4 grid gap-12 lg:grid-cols-2 items-center">
        <img
          src="/assets/images/blog/blog-6.jpg"
          alt="About Furnicasa"
          className="w-full rounded shadow"
        />
        <div className="space-y-4">
          <span className="text-orange-600 font-medium">Since 2019</span>
          <h2 className="text-3xl font-semibold">
            Providing the Best Quality Furniture for You
          </h2>
          <p className="text-gray-700">
            At Furnicasa, we believe your home should tell the story of who
            you are. That’s why we curate only the finest pieces—modern,
            affordable, and built to last.
          </p>
          <p className="text-gray-700">
            From sleek sofas to elegant dining sets, our range is designed
            to elevate every corner of your space.
          </p>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section
        className="relative h-80 bg-cover bg-center flex items-center"
        style={{
          backgroundImage: "url('/assets/images/banner/banner3.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 text-center w-full px-4">
          <span className="block text-white uppercase mb-2">
            Discounted up to 50%
          </span>
          <h2 className="text-4xl text-white font-bold mb-2">
            Zigzag King Chair
          </h2>
          <span className="block text-white uppercase mb-4">
            Limited Time Offer
          </span>
          <Link
            to="/products"
            className="inline-block bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
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

      {/* Our Team */}
      <section className="container mx-auto px-4 space-y-8">
        <h2 className="text-3xl font-semibold text-center">Our Team</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.name}
              className="group overflow-hidden rounded shadow relative"
            >
              <img
                src={m.img}
                alt={m.name}
                className="w-full h-80 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white translate-y-full group-hover:translate-y-0 transition">
                <h3 className="font-semibold">{m.name}</h3>
                <div className="flex space-x-3 mt-2 text-gray-600">
                  <a href="#" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" aria-label="Facebook">
                    <i className="fab fa-facebook"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 space-y-12">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="grid gap-8 lg:grid-cols-2 items-center"
            >
              <img
                src={t.img}
                alt=""
                className="w-full rounded shadow"
              />
              <div className="space-y-4">
                <blockquote className="text-lg italic text-gray-700">
                  “{t.quote}”
                </blockquote>
                <div className="flex items-center space-x-4">
                  <img
                    src={t.authorImg}
                    alt={t.author}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{t.author}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
