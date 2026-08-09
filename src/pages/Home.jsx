// src/pages/Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Quote,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import Tilt from "../components/ui/Tilt";
import Magnetic from "../components/ui/Magnetic";
import Marquee from "../components/ui/Marquee";
import Counter from "../components/ui/Counter";
import { Section, SectionHeading } from "../components/ui/Section";
import { ProductGridSkeleton, Skeleton } from "../components/ui/Skeleton";
import { ArrowLink, Price, ProductImage, Stars } from "../components/ui/Bits";
import { EASE, spring, viewportOnce } from "../components/ui/motion";

/* hero photography dropped into /src/assets/hero/ */
const heroImages = Object.values(
  import.meta.glob("/src/assets/hero/*.{jpg,jpeg,png}", {
    eager: true,
    query: "?url",
    import: "default",
  })
);

const TRUST = [
  "Free delivery over ₹10,000",
  "1-year warranty",
  "Made to order",
  "Solid hardwood frames",
  "10-day replacement",
  "Serving India since 2019",
];

const PROMISES = [
  {
    icon: Truck,
    title: "Free home delivery",
    desc: "Curb-side delivery at no cost across India on orders over ₹10,000.",
  },
  {
    icon: ShieldCheck,
    title: "Built to last",
    desc: "Kiln-dried hardwood, reinforced joinery and a full one-year warranty.",
  },
  {
    icon: RefreshCw,
    title: "10-day replacement",
    desc: "Something not right? We repair or replace it — no runaround.",
  },
];

const TESTIMONIALS = [
  { name: "Riya Patel", city: "Pune", rating: 5, quote: "Loved the midnight-blue sofa — plush, sturdy and delivered right on time." },
  { name: "Aakash Verma", city: "Delhi", rating: 4, quote: "Dining set quality is excellent. A minor scratch was handled the same week." },
  { name: "Meera Nair", city: "Kochi", rating: 5, quote: "The whole ordering flow was smooth and the pieces feel genuinely premium." },
  { name: "Kabir Singh", city: "Jaipur", rating: 5, quote: "Got a custom bookshelf made — communication and finish were spot-on." },
  { name: "Tanvi Kulkarni", city: "Mumbai", rating: 5, quote: "Exchanged a coffee table hassle-free. The replacement policy actually works." },
];

/* ════════════════════════════════════════════════════════════
   HERO — a rotating 3D stack of photography with pointer parallax
   ════════════════════════════════════════════════════════════ */
function Hero() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const count = heroImages.length;

  /* pointer parallax */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const cfg = { stiffness: 90, damping: 20 };
  const rotY = useSpring(useTransform(mx, [0, 1], [10, -10]), cfg);
  const rotX = useSpring(useTransform(my, [0, 1], [-8, 8]), cfg);
  const copyX = useSpring(useTransform(mx, [0, 1], [12, -12]), cfg);

  /* scroll parallax */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const stackY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), 5200);
    return () => clearInterval(id);
  }, [count]);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  /* where each card sits relative to the front of the stack */
  const slot = (pos) =>
    [
      { x: 0, y: 0, z: 0, scale: 1, rotateY: 0, opacity: 1 },
      { x: 46, y: -28, z: -120, scale: 0.93, rotateY: -9, opacity: 0.8 },
      { x: 86, y: -54, z: -240, scale: 0.86, rotateY: -15, opacity: 0.45 },
    ][pos] || { x: 110, y: -70, z: -340, scale: 0.8, rotateY: -18, opacity: 0 };

  const words = "Furniture that earns its place".split(" ");

  return (
    <section
      ref={ref}
      onMouseMove={reduced ? undefined : onMove}
      className="relative isolate overflow-hidden bg-ink-950 text-sand-50"
    >
      {/* light */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="blob -left-32 top-0 h-[34rem] w-[34rem] animate-drift bg-clay-600/30" />
        <div
          className="blob right-0 top-1/4 h-[30rem] w-[30rem] animate-drift bg-jade-600/25"
          style={{ animationDelay: "-8s" }}
        />
        <div
          className="blob bottom-0 left-1/3 h-[26rem] w-[26rem] animate-drift bg-gold-500/20"
          style={{ animationDelay: "-15s" }}
        />
      </div>
      <div aria-hidden className="grain absolute inset-0 -z-10" />

      <div className="container-x grid items-center gap-16 py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-28">
        {/* ── copy ── */}
        <motion.div style={{ y: copyY, x: reduced ? 0 : copyX, opacity: fade }}>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-sand-100 backdrop-blur"
          >
            <Sparkles size={14} className="text-clay-400" />
            Handcrafted in Jaipur · Delivered across India
          </motion.span>

          <h1 className="mb-6 font-display text-[2.75rem] font-semibold leading-[1.05] text-sand-50 sm:text-6xl lg:text-[4.2rem]">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className={`inline-block ${
                    w === "earns" ? "text-gradient" : ""
                  }`}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.85, ease: EASE, delay: 0.1 + i * 0.07 }}
                >
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
            className="mb-9 max-w-lg text-lg leading-relaxed text-ink-300"
          >
            Sofas, beds and dining sets built to order from solid hardwood —
            designed for real rooms, priced without the showroom mark-up.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.25}>
              <Link to="/products" className="btn-primary btn-sheen btn-lg">
                Explore the collection
                <ArrowRight size={17} />
              </Link>
            </Magnetic>

            <Link
              to="/about"
              className="btn btn-lg border border-white/20 text-sand-50 hover:border-white/50 hover:bg-white/10"
            >
              Our story
            </Link>
          </motion.div>

          {/* stats */}
          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
            className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8"
          >
            {[
              { v: 1200, s: "+", l: "Homes furnished" },
              { v: 6, s: " yrs", l: "Crafting furniture" },
              { fixed: "4.8", s: "/5", l: "Customer rating" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-3xl font-semibold text-sand-50">
                  {s.fixed ? s.fixed : <Counter value={s.v} />}
                  <span className="text-clay-400">{s.s}</span>
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-ink-400">
                  {s.l}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* ── 3D image stack ── */}
        <motion.div
          style={{ y: stackY, opacity: fade }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="perspective-1600">
            <motion.div
              className="preserve-3d relative aspect-[4/5] w-full"
              style={reduced ? undefined : { rotateX: rotX, rotateY: rotY }}
            >
              {heroImages.length === 0 && (
                <div className="absolute inset-0 rounded-[2rem] bg-white/5" />
              )}

              {heroImages.map((src, i) => {
                const pos = (i - active + count) % count;
                const s = slot(pos);
                return (
                  <motion.figure
                    key={src}
                    className="preserve-3d absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 shadow-float"
                    animate={{
                      x: s.x,
                      y: s.y,
                      z: s.z,
                      scale: s.scale,
                      rotateY: s.rotateY,
                      opacity: s.opacity,
                    }}
                    transition={{ duration: 0.9, ease: EASE }}
                    style={{ zIndex: count - pos }}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-transparent" />
                  </motion.figure>
                );
              })}
            </motion.div>
          </div>

          {/* floating chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, ...spring }}
            className="absolute -bottom-5 -left-4 z-20 animate-float rounded-2xl border border-white/20 bg-ink-950/95 px-5 py-4 shadow-float backdrop-blur-xl sm:-left-8"
          >
            <div className="flex items-center gap-3">
              <Stars value={5} size={13} />
              <span className="text-xs font-semibold text-sand-50">4.8 / 5</span>
            </div>
            <p className="mt-1 text-[11px] text-ink-300">
              from 300+ verified buyers
            </p>
          </motion.div>

          {/* slide dots */}
          {count > 1 && (
            <div className="absolute -bottom-12 right-0 z-20 flex gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                  className="group h-6 w-6 p-2"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-500 ${
                      i === active
                        ? "w-6 bg-clay-400"
                        : "w-1.5 bg-white/30 group-hover:bg-white/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* trust marquee */}
      <div className="relative border-t border-white/10 py-5">
        <Marquee speed={40}>
          {TRUST.map((t) => (
            <span
              key={t}
              className="flex items-center gap-6 whitespace-nowrap px-6 text-sm font-medium text-ink-400"
            >
              {t}
              <span className="h-1 w-1 rounded-full bg-clay-500" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   CATEGORY RAIL
   ════════════════════════════════════════════════════════════ */
function CategoryRail({ categories, products, loading }) {
  const navigate = useNavigate();

  /* one representative image per category */
  const cards = useMemo(
    () =>
      categories.slice(0, 6).map((cat) => ({
        cat,
        image: products.find((p) => p.category === cat)?.imageUrl,
        count: products.filter((p) => p.category === cat).length,
      })),
    [categories, products]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[5/6] rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
      {cards.map(({ cat, image, count }, i) => (
        <motion.div
          key={cat}
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.65, ease: EASE, delay: i * 0.07 }}
        >
          <Tilt max={8} scale={1.02}>
            <button
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`, { state: { category: cat } })}
              className="group relative block aspect-[5/6] w-full overflow-hidden rounded-3xl bg-ink-900 text-left shadow-card"
            >
              <ProductImage
                src={image}
                alt={cat}
                className="h-full w-full object-cover opacity-80 transition-all duration-700 ease-out-expo group-hover:scale-110 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[.18em] text-clay-300">
                  {count} {count === 1 ? "piece" : "pieces"}
                </p>
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold capitalize text-sand-50 sm:text-2xl">
                  {cat}
                  <ArrowRight
                    size={18}
                    className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </h3>
              </div>
            </button>
          </Tilt>
        </motion.div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FEATURED DEALS — asymmetric bento
   ════════════════════════════════════════════════════════════ */
function Deals({ products }) {
  const deals = useMemo(() => {
    const discounted = products
      .filter((p) => (p.discountPercent || 0) > 0)
      .sort((a, b) => b.discountPercent - a.discountPercent);
    return (discounted.length >= 3 ? discounted : products).slice(0, 3);
  }, [products]);

  if (deals.length < 3) return null;

  const [lead, ...rest] = deals;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* lead */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Link
          to={`/product/${lead._id}`}
          className="group relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-[2rem] bg-ink-900 p-8 shadow-card"
        >
          <ProductImage
            src={lead.imageUrl}
            alt={lead.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-transparent" />

          {lead.discountPercent > 0 && (
            <span className="absolute left-6 top-6 badge bg-clay-grad text-white shadow-glow">
              Save {lead.discountPercent}%
            </span>
          )}

          <div className="relative">
            <p className="eyebrow mb-2 text-clay-300">Featured</p>
            <h3 className="mb-3 max-w-md font-display text-3xl font-semibold text-sand-50 sm:text-4xl">
              {lead.title}
            </h3>
            <Price
              price={lead.price}
              discountPercent={lead.discountPercent || 0}
              size="lg"
              invert
            />
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sand-50">
              <span className="link-underline">Shop this piece</span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </div>
        </Link>
      </motion.div>

      {/* two stacked */}
      <div className="grid gap-5">
        {rest.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 * (i + 1) }}
          >
            <Link
              to={`/product/${p._id}`}
              className="group relative flex h-full min-h-[12rem] items-center gap-6 overflow-hidden rounded-[2rem] border border-ink-100 bg-white p-6 shadow-card transition-shadow hover:shadow-lift"
            >
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-sand-100 sm:h-40 sm:w-40">
                <ProductImage
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
                />
              </div>

              <div className="min-w-0">
                {p.discountPercent > 0 && (
                  <span className="badge mb-2 bg-clay-100 text-clay-700">
                    Save {p.discountPercent}%
                  </span>
                )}
                <h3 className="line-clamp-2-safe mb-2 font-display text-lg font-semibold text-ink-900 transition-colors group-hover:text-clay-700">
                  {p.title}
                </h3>
                <Price price={p.price} discountPercent={p.discountPercent || 0} />
              </div>

              <ArrowRight
                size={18}
                className="ml-auto hidden shrink-0 text-ink-300 transition-all group-hover:translate-x-1 group-hover:text-clay-600 sm:block"
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   POPULAR — animated category tabs
   ════════════════════════════════════════════════════════════ */
function Popular({ products, categories, loading }) {
  const [activeCat, setActiveCat] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeCat && categories.length) setActiveCat(categories[0]);
  }, [categories, activeCat]);

  const items = useMemo(
    () => products.filter((p) => p.category === activeCat).slice(0, 8),
    [products, activeCat]
  );

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`relative rounded-full px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
              activeCat === cat ? "text-sand-50" : "text-ink-600 hover:text-ink-900"
            }`}
          >
            {activeCat === cat && (
              <motion.span
                layoutId="popular-tab"
                transition={spring}
                className="absolute inset-0 rounded-full bg-ink-900 shadow-lift"
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {items.length === 0 ? (
              <p className="col-span-full py-12 text-center text-ink-500">
                Nothing in this category just yet.
              </p>
            ) : (
              items.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <div className="mt-14 flex justify-center">
        <Magnetic strength={0.2}>
          <button
            onClick={() =>
              navigate(`/products?category=${encodeURIComponent(activeCat)}`, {
                state: { category: activeCat },
              })
            }
            className="btn-outline btn-lg"
          >
            View all <span className="capitalize">{activeCat}</span>
            <ArrowRight size={16} />
          </button>
        </Magnetic>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════ */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then(({ data }) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  return (
    <div>
      <Hero />

      {/* ── categories ── (skipped entirely if the catalogue is empty, so the
           page never shows a heading above a blank grid) */}
      {(loading || categories.length > 0) && (
        <Section size="lg">
          <div className="container-x">
            <SectionHeading
              kicker="Browse"
              title="Shop by room"
              subtitle="Every category is built around how the room is actually used — not how it photographs."
              align="left"
              action={<ArrowLink to="/products">See everything</ArrowLink>}
            />
            <CategoryRail
              categories={categories}
              products={products}
              loading={loading}
            />
          </div>
        </Section>
      )}

      {/* ── deals ── */}
      {!loading && products.length > 0 && (
        <Section tone="white" size="lg" className="rounded-t-[3rem]">
          <div className="container-x">
            <SectionHeading
              kicker="Right now"
              title="Great deals worth a second look"
              align="left"
            />
            <Deals products={products} />
          </div>
        </Section>
      )}

      {/* ── popular ── */}
      {(loading || categories.length > 0) && (
        <Section tone="sand" size="lg">
          <div className="container-x">
            <SectionHeading
              kicker="Bestsellers"
              title="Popular furniture"
              subtitle="The pieces our customers keep coming back for."
            />
            <Popular
              products={products}
              categories={categories}
              loading={loading}
            />
          </div>
        </Section>
      )}

      {/* ── promises ── */}
      <Section size="lg">
        <div className="container-x">
          <SectionHeading
            kicker="Why Furnicasa"
            title="No showroom mark-up. No compromises."
            subtitle="We build to order in our own Jaipur workshop and ship direct, so the money goes into the furniture rather than the retail floor."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {PROMISES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 36, rotateX: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
                style={{ transformPerspective: 1200 }}
              >
                <Tilt max={9} scale={1.03} className="h-full">
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white p-8 shadow-card transition-shadow duration-500 hover:shadow-lift">
                    <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-clay-100/60 transition-transform duration-700 group-hover:scale-150" />

                    <span className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-sand-50 shadow-lift transition-colors duration-500 group-hover:bg-clay-600">
                      <Icon size={24} strokeWidth={1.7} />
                    </span>

                    <h3 className="relative mb-3 font-display text-xl font-semibold text-ink-900">
                      {title}
                    </h3>
                    <p className="relative text-[15px] leading-relaxed text-ink-500">
                      {desc}
                    </p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── testimonials ── */}
      <Section tone="ink" size="lg" className="overflow-hidden">
        <div className="container-x">
          <SectionHeading
            kicker="Word of mouth"
            title="What people say once it's in the room"
            invert
          />
        </div>

        <Marquee speed={52} itemClassName="px-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex h-full w-[21rem] flex-col rounded-3xl border border-white/10 bg-white/[.04] p-7 backdrop-blur sm:w-[24rem]"
            >
              <Quote size={24} className="mb-4 text-clay-400" />
              <blockquote className="mb-6 flex-1 text-[15px] leading-relaxed text-ink-200">
                “{t.quote}”
              </blockquote>
              <figcaption className="flex items-center justify-between border-t border-white/10 pt-5">
                <div>
                  <p className="text-sm font-semibold text-sand-50">{t.name}</p>
                  <p className="text-xs text-ink-400">{t.city}</p>
                </div>
                <Stars value={t.rating} size={13} />
              </figcaption>
            </figure>
          ))}
        </Marquee>
      </Section>

      {/* ── closing CTA ── */}
      <Section size="lg">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative isolate overflow-hidden rounded-[2.5rem] bg-ink-grad px-8 py-16 text-center shadow-float sm:px-16 sm:py-24"
          >
            <div aria-hidden className="absolute inset-0 -z-10">
              <div className="blob -left-20 top-0 h-80 w-80 animate-drift bg-clay-600/35" />
              <div
                className="blob -right-16 bottom-0 h-72 w-72 animate-drift bg-jade-600/25"
                style={{ animationDelay: "-9s" }}
              />
            </div>
            <div aria-hidden className="grain absolute inset-0 -z-10" />

            <p className="eyebrow mb-5 justify-center text-clay-300">
              Ready when you are
            </p>
            <h2 className="mx-auto mb-6 max-w-2xl font-display text-4xl font-semibold text-sand-50 sm:text-5xl">
              Let's build the room you keep imagining
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-ink-300">
              Browse the catalogue, or tell us what you have in mind and we'll
              make it to measure.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Magnetic strength={0.25}>
                <Link to="/products" className="btn-primary btn-sheen btn-lg">
                  Start browsing
                  <ArrowRight size={17} />
                </Link>
              </Magnetic>
              <Link
                to="/contact"
                className="btn btn-lg border border-white/20 text-sand-50 hover:border-white/50 hover:bg-white/10"
              >
                Talk to us
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
