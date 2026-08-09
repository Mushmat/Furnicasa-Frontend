// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Hammer,
  Leaf,
  Ruler,
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import { Section, SectionHeading } from "../components/ui/Section";
import Tilt from "../components/ui/Tilt";
import Counter from "../components/ui/Counter";
import Reveal, { RevealGroup, RevealItem } from "../components/ui/Reveal";
import { Stars } from "../components/ui/Bits";
import { EASE, viewportOnce } from "../components/ui/motion";

const FEATURES = [
  {
    icon: Truck,
    title: "Free home delivery",
    desc: "Curb-side delivery at no cost on every order over ₹10,000, anywhere in India.",
  },
  {
    icon: ShieldCheck,
    title: "Quality you can feel",
    desc: "Kiln-dried hardwood, reinforced joinery and finishes chosen to age well.",
  },
  {
    icon: RefreshCw,
    title: "10-day replacement",
    desc: "If something arrives wrong, we repair or replace it — no negotiation.",
  },
];

const VALUES = [
  {
    icon: Hammer,
    title: "Made, not assembled",
    desc: "Every piece is built to order in our own Jaipur workshop rather than pulled off a pallet.",
  },
  {
    icon: Ruler,
    title: "Designed for real rooms",
    desc: "Proportions are drawn for Indian homes and doorways, not showroom photography.",
  },
  {
    icon: Leaf,
    title: "Built to stay",
    desc: "Solid frames and repairable construction, so furniture outlives the trend that inspired it.",
  },
];

const STATS = [
  { value: 1200, suffix: "+", label: "Homes furnished" },
  { value: 6, suffix: " yrs", label: "In the workshop" },
  { value: 300, suffix: "+", label: "Verified reviews" },
  { value: 24, suffix: " hrs", label: "Avg. reply time" },
];

const ME = {
  img: "/assets/images/team/placeholder-dev.jpg",
  name: "Chirayu Choudhary",
  role: "Full-Stack Developer",
  bio: `I'm an Integrated M.Tech (CSE) student at the International Institute of Information Technology, Bangalore. This entire website — front and back — was built in-house for my father's company, letting me blend academic learning with real-world product engineering.`,
  links: {
    github: "https://github.com/Mushmat",
    linkedin: "https://www.linkedin.com/in/chirayu-choudhary-560837277",
    mail: "mailto:edu.chirayu2005@gmail.com",
  },
};

const REVIEWS = [
  { name: "Riya Patel", rating: 5, comment: "Loved the midnight-blue sofa — plush, sturdy and delivered on time!" },
  { name: "Aakash Verma", rating: 4, comment: "Dining set quality is excellent. Minor scratch on one chair, customer care handled it quickly." },
  { name: "Meera Nair", rating: 5, comment: "Website UI is smooth and ordering was genuinely easy." },
  { name: "Kabir Singh", rating: 4, comment: "Got a custom bookshelf made; communication and finish were spot-on." },
  { name: "Tanvi Kulkarni", rating: 5, comment: "The replacement policy actually works — I exchanged a coffee table hassle-free." },
  { name: "Rahul Menon", rating: 5, comment: "Great mix of modern and classic designs at sane prices. Highly recommend." },
];

export default function About() {
  return (
    <div>
      <PageHeader
        kicker="Since 2019"
        title="Furniture made the long way round"
        subtitle="We design and build in our own workshop, then ship straight to your door — no middlemen, no showroom mark-up."
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      {/* ── story ── */}
      <Section size="lg">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal direction="right">
            <Tilt max={6} scale={1.02}>
              <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
                <img
                  src="/assets/images/blog/blog-6.png"
                  alt="Inside the Furnicasa workshop"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/35 to-transparent" />
              </div>
            </Tilt>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <span className="eyebrow mb-4">Our story</span>
            <h2 className="mb-6 font-display text-3xl font-semibold sm:text-[2.5rem] sm:leading-tight">
              Providing quality furniture for modern living
            </h2>
            <div className="space-y-4 text-[17px] leading-relaxed text-ink-600">
              <p>
                At Furnicasa we believe your home should tell the story of who
                you are. That's why every piece is curated for style, durability
                and value — and why we'd rather build fewer things properly than
                many things quickly.
              </p>
              <p>
                From sleek sofas to handcrafted dining sets, our catalogue is
                meant to elevate every corner of your space. Because we build to
                order and ship direct, the money goes into the furniture instead
                of the retail floor.
              </p>
            </div>

            <Link to="/products" className="btn-ink mt-8">
              See what we make
              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* ── stats ── */}
      <Section tone="ink" size="md">
        <div className="container-x">
          <RevealGroup className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <RevealItem key={s.label} className="text-center">
                <p className="font-display text-4xl font-semibold text-sand-50 sm:text-5xl">
                  <Counter value={s.value} />
                  <span className="text-clay-400">{s.suffix}</span>
                </p>
                <p className="mt-2 text-xs uppercase tracking-[.18em] text-ink-400">
                  {s.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── values ── */}
      <Section size="lg">
        <div className="container-x">
          <SectionHeading
            kicker="How we work"
            title="Three things we refuse to compromise on"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 36, rotateX: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
                style={{ transformPerspective: 1200 }}
              >
                <Tilt max={9} scale={1.03} className="h-full">
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white p-8 shadow-card transition-shadow duration-500 hover:shadow-lift">
                    <span className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-jade-100/70 transition-transform duration-700 group-hover:scale-150" />
                    <span className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-sand-50 transition-colors duration-500 group-hover:bg-jade-600">
                      <v.icon size={23} strokeWidth={1.7} />
                    </span>
                    <h3 className="relative mb-3 font-display text-xl font-semibold">
                      {v.title}
                    </h3>
                    <p className="relative leading-relaxed text-ink-500">
                      {v.desc}
                    </p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── promises ── */}
      <Section tone="sand" size="lg">
        <div className="container-x">
          <SectionHeading
            kicker="What you get"
            title="The promises attached to every order"
            align="left"
          />

          <RevealGroup className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <RevealItem key={f.title}>
                <div className="flex h-full items-start gap-5 rounded-3xl border border-ink-100 bg-white p-7 shadow-soft">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-clay-50 text-clay-600">
                    <f.icon size={21} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="mb-2 font-display text-lg font-semibold">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-500">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── the developer ── */}
      <Section size="lg">
        <div className="container-x">
          <SectionHeading
            kicker="Behind the site"
            title="Built in-house, end to end"
            align="left"
          />

          <Reveal>
            <div className="grid gap-10 overflow-hidden rounded-[2rem] border border-ink-100 bg-white p-8 shadow-card sm:p-10 lg:grid-cols-[16rem_1fr] lg:items-center">
              <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-3xl bg-sand-100 lg:w-full">
                <img
                  src={ME.img}
                  alt={ME.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div>
                <h3 className="font-display text-2xl font-semibold">{ME.name}</h3>
                <p className="mb-5 text-sm font-medium uppercase tracking-[.16em] text-clay-600">
                  {ME.role}
                </p>
                <p className="mb-7 max-w-2xl leading-relaxed text-ink-600">
                  {ME.bio}
                </p>

                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Github, href: ME.links.github, label: "GitHub" },
                    { icon: Linkedin, href: ME.links.linkedin, label: "LinkedIn" },
                    { icon: Mail, href: ME.links.mail, label: "Email" },
                  ].map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      whileHover={{ y: -3 }}
                      className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-sand-50"
                    >
                      <Icon size={15} />
                      {label}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── reviews ── */}
      <Section tone="sand" size="lg">
        <div className="container-x">
          <SectionHeading
            kicker="Customer voices"
            title="What people say once it's in the room"
          />

          <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {REVIEWS.map((r) => (
              <RevealItem key={r.name}>
                <figure className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-7 shadow-soft transition-shadow hover:shadow-card">
                  <Stars value={r.rating} size={15} className="mb-5" />
                  <blockquote className="mb-6 flex-1 leading-relaxed text-ink-600">
                    “{r.comment}”
                  </blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-ink-100 pt-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 font-display text-xs font-semibold text-sand-50">
                      {r.name.charAt(0)}
                    </span>
                    <span className="text-sm font-semibold text-ink-900">
                      {r.name}
                    </span>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section size="lg">
        <div className="container-x">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-ink-grad px-8 py-16 text-center shadow-float sm:px-16">
              <div aria-hidden className="absolute inset-0 -z-10">
                <div className="blob -left-16 top-0 h-72 w-72 animate-drift bg-clay-600/35" />
                <div
                  className="blob -right-12 bottom-0 h-64 w-64 animate-drift bg-jade-600/25"
                  style={{ animationDelay: "-8s" }}
                />
              </div>
              <div aria-hidden className="grain absolute inset-0 -z-10" />

              <h2 className="mx-auto mb-5 max-w-2xl font-display text-3xl font-semibold text-sand-50 sm:text-4xl">
                Have something specific in mind?
              </h2>
              <p className="mx-auto mb-9 max-w-xl text-ink-300">
                Tell us the dimensions, the fabric and the room — we'll build it
                to measure.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn-primary btn-sheen btn-lg">
                  Talk to us
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/products"
                  className="btn btn-lg border border-white/20 text-sand-50 hover:border-white/50 hover:bg-white/10"
                >
                  Browse the catalogue
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
