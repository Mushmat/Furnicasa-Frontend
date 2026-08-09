// src/pages/Products.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, PackageSearch, Check } from "lucide-react";

import { fetchProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import PageHeader from "../components/ui/PageHeader";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import { EmptyState, inr } from "../components/ui/Bits";
import { EASE, spring } from "../components/ui/motion";

const PER_PAGE = 12;

const SORTS = [
  { value: "", label: "Featured" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A → Z" },
  { value: "name_desc", label: "Name: Z → A" },
];

const nice = (cat) =>
  cat === "all" ? "All products" : cat.replace(/\b\w/g, (c) => c.toUpperCase());

export default function Products() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryParam = params.get("q")?.toLowerCase() || "";
  /* the navbar links with ?category=…, older links use router state */
  const urlCat = (params.get("category") || location.state?.category || "all").toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState(urlCat);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /* react to navigation from the navbar / footer */
  useEffect(() => {
    setCategory(urlCat);
    setPage(1);
  }, [urlCat]);

  useEffect(() => setPage(1), [queryParam]);

  const categories = useMemo(() => {
    const set = new Set(
      products.map((p) => (p.category || "Uncategorized").toLowerCase())
    );
    return ["all", ...Array.from(set)];
  }, [products]);

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price || 0);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => (p.category || "").toLowerCase() === category);
    }

    if (queryParam) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(queryParam) ||
          (p.category || "").toLowerCase().includes(queryParam)
      );
    }

    const lo = minPrice === "" ? -Infinity : Number(minPrice);
    const hi = maxPrice === "" ? Infinity : Number(maxPrice);
    list = list.filter((p) => p.price >= lo && p.price <= hi);

    const sorters = {
      price_asc: (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      name_asc: (a, b) => a.title.localeCompare(b.title),
      name_desc: (a, b) => b.title.localeCompare(a.title),
    };
    if (sortBy) list.sort(sorters[sortBy]);

    return list;
  }, [products, category, minPrice, maxPrice, sortBy, queryParam]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pages);
  const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const hasPriceFilter = minPrice !== "" || maxPrice !== "";
  const activeFilters = (category !== "all" ? 1 : 0) + (hasPriceFilter ? 1 : 0);

  const clearAll = () => {
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setPage(1);
  };

  const goto = (n) => {
    setPage(n);
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  /* Filter panel markup, shared by the sidebar and the mobile sheet.
     Kept as an element rather than a nested component so the price inputs
     don't remount (and lose focus) on every keystroke. */
  const filterPanel = (
    <div className="space-y-8">
      {/* categories */}
      <div>
        <h3 className="label">Category</h3>
        <ul className="space-y-1">
          {categories.map((cat) => {
            const isActive = category === cat;
            const count =
              cat === "all"
                ? products.length
                : products.filter(
                    (p) => (p.category || "").toLowerCase() === cat
                  ).length;

            return (
              <li key={cat}>
                <button
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                    setFiltersOpen(false);
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-ink-900 font-semibold text-sand-50"
                      : "text-ink-600 hover:bg-sand-100 hover:text-ink-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isActive && <Check size={14} />}
                    {nice(cat)}
                  </span>
                  <span
                    className={`text-xs ${isActive ? "text-ink-300" : "text-ink-400"}`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* price */}
      <div>
        <h3 className="label">Price range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            placeholder={priceBounds.min ? String(priceBounds.min) : "Min"}
            className="input py-2.5 text-sm"
            aria-label="Minimum price"
          />
          <span className="text-ink-300">–</span>
          <input
            type="number"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            placeholder={priceBounds.max ? String(priceBounds.max) : "Max"}
            className="input py-2.5 text-sm"
            aria-label="Maximum price"
          />
        </div>
        {priceBounds.max > 0 && (
          <p className="mt-2 text-xs text-ink-400">
            Catalogue spans {inr(priceBounds.min)} – {inr(priceBounds.max)}
          </p>
        )}
        {hasPriceFilter && (
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setPage(1);
            }}
            className="mt-3 text-xs font-semibold text-clay-600 hover:underline"
          >
            Clear price filter
          </button>
        )}
      </div>

      {activeFilters > 0 && (
        <button onClick={clearAll} className="btn-ghost btn-sm w-full">
          Reset all filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader
        kicker="The catalogue"
        title={queryParam ? `Results for “${queryParam}”` : "Shop"}
        subtitle={
          queryParam
            ? undefined
            : "Made-to-order furniture in solid hardwood, shipped straight from our Jaipur workshop."
        }
        crumbs={[{ label: "Home", to: "/" }, { label: "Shop" }]}
      />

      <div className="container-x py-14">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* ── sidebar ── */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-32 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
              {filterPanel}
            </div>
          </aside>

          {/* ── results ── */}
          <main className="min-w-0 flex-1">
            {/* toolbar */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display text-xl font-semibold text-ink-900">
                  {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}
                </p>
                {!loading && category !== "all" && (
                  <p className="text-sm text-ink-500">in {nice(category)}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="btn-outline btn-sm lg:hidden"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {activeFilters > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-clay-600 text-[10px] font-bold text-white">
                      {activeFilters}
                    </span>
                  )}
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Sort products"
                  className="select w-48 py-2.5 text-sm"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* active filter chips */}
            <AnimatePresence>
              {activeFilters > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 flex flex-wrap items-center gap-2 overflow-hidden"
                >
                  {category !== "all" && (
                    <FilterChip onClear={() => setCategory("all")}>
                      {nice(category)}
                    </FilterChip>
                  )}
                  {hasPriceFilter && (
                    <FilterChip
                      onClear={() => {
                        setMinPrice("");
                        setMaxPrice("");
                      }}
                    >
                      {minPrice !== "" ? inr(minPrice) : "Any"} –{" "}
                      {maxPrice !== "" ? inr(maxPrice) : "Any"}
                    </FilterChip>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* grid */}
            {loading ? (
              <ProductGridSkeleton count={9} />
            ) : error ? (
              <EmptyState
                icon={PackageSearch}
                title="We couldn't load the catalogue"
                description={error}
                action={
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Try again
                  </button>
                }
              />
            ) : pageItems.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="Nothing matches those filters"
                description="Try widening the price range or picking a different category."
                action={
                  <button onClick={clearAll} className="btn-primary">
                    Reset filters
                  </button>
                }
              />
            ) : (
              <motion.div
                key={`${category}-${sortBy}-${safePage}-${queryParam}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {pageItems.map((prod, i) => (
                  <ProductCard key={prod._id} product={prod} index={i} />
                ))}
              </motion.div>
            )}

            {/* pagination */}
            {!loading && pages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-16 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  onClick={() => goto(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  className="btn-ghost btn-sm disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({ length: pages }).map((_, i) => {
                  const n = i + 1;
                  const isActive = n === safePage;
                  return (
                    <button
                      key={n}
                      onClick={() => goto(n)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative h-10 w-10 rounded-full text-sm font-semibold transition-colors ${
                        isActive ? "text-sand-50" : "text-ink-600 hover:bg-sand-200"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="page-pill"
                          transition={spring}
                          className="absolute inset-0 rounded-full bg-ink-900"
                        />
                      )}
                      <span className="relative z-10">
                        {String(n).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}

                <button
                  onClick={() => goto(Math.min(pages, safePage + 1))}
                  disabled={safePage === pages}
                  className="btn-ghost btn-sm disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>

      {/* ── mobile filter sheet ── */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-ink-950/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-sand-50 p-6 shadow-float lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/5"
                >
                  <X size={18} />
                </button>
              </div>

              {filterPanel}

              <button
                onClick={() => setFiltersOpen(false)}
                className="btn-primary mt-8 w-full"
              >
                Show {filtered.length} results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ children, onClear }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1.5 pl-4 pr-2 text-sm text-ink-700">
      {children}
      <button
        onClick={onClear}
        aria-label="Remove filter"
        className="flex h-5 w-5 items-center justify-center rounded-full bg-ink-900/10 transition-colors hover:bg-clay-600 hover:text-white"
      >
        <X size={12} />
      </button>
    </span>
  );
}
