import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { fetchProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function Products() {
  /* ───── routing state ───── */
  const location = useLocation();
  const queryParam =
    new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  const startCat = (location.state?.category || "All").toLowerCase();

  /* ───── data state ───── */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ───── ui / filter state ───── */
  const [category, setCategory] = useState(startCat);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /* ───── fetch once ───── */
  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /* react to category changes from navbar */
  useEffect(() => {
    const newCat = (location.state?.category || "All").toLowerCase();
    setCategory(newCat);
    setPage(1);
  }, [location.state?.category]);

  useEffect(() => setPage(1), [queryParam]);

  /* category list */
  const categories = useMemo(() => {
    const set = new Set(
      products.map((p) => (p.category || "Uncategorized").toLowerCase())
    );
    return ["all", ...Array.from(set)];
  }, [products]);

  /* filter / sort / paginate */
  const perPage = 12;

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter(
        (p) => (p.category || "").toLowerCase() === category
      );
    }

    if (queryParam) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(queryParam) ||
          (p.category || "").toLowerCase().includes(queryParam)
      );
    }

    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    const sorters = {
      price_asc: (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      name_asc: (a, b) => a.title.localeCompare(b.title),
      name_desc: (a, b) => b.title.localeCompare(a.title),
    };
    if (sortBy) list.sort(sorters[sortBy]);

    return list;
  }, [products, category, minPrice, maxPrice, sortBy, queryParam]);

  const pages = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* guards */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-destructive text-lg font-medium">{error}</p>
        </div>
      </div>
    );

  /* helper */
  const nice = (cat) =>
    cat === "all" ? "All Products" : cat.replace(/\b\w/g, (c) => c.toUpperCase());

  /* ───── Filter Sidebar Component ───── */
  const FilterSidebar = ({ isMobile = false }) => (
    <aside className={`space-y-6 ${isMobile ? 'p-6' : ''}`}>
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </h2>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Categories
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
                if (isMobile) setShowMobileFilters(false);
              }}
              className={`filter-button ${
                category === cat ? "filter-button-active" : ""
              }`}
            >
              <span className="flex items-center justify-between">
                {nice(cat)}
                {category === cat && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* price filter */}
      <div className="space-y-3 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Price Range
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Min</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full border border-input bg-background px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Max</label>
              <input
                type="number"
                value={maxPrice === Infinity ? "" : maxPrice}
                onChange={(e) => {
                  const v = e.target.value;
                  setMaxPrice(v === "" ? Infinity : Number(v));
                }}
                className="w-full border border-input bg-background px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="Any"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              onClick={() => setPage(1)}
            >
              Apply
            </button>
            <button
              className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(Infinity);
                setPage(1);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* sort */}
      <div className="space-y-3 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Sort By
        </h3>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="w-full border border-input bg-background px-4 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
        >
          <option value="">Default sorting</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A → Z</option>
          <option value="name_desc">Name: Z → A</option>
        </select>
      </div>
    </aside>
  );

  /* ───── render ───── */
  return (
    <div className="min-h-screen bg-background">
      {/* banner */}
      <section
        className="relative bg-cover bg-center h-[400px] flex items-center justify-center"
        style={{ backgroundImage: "url('/assets/images/bg/breadcrumb.png')" }}
      >
        <div className="page-banner-overlay" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            Shop
          </h1>
          <nav className="flex items-center justify-center gap-2 text-lg">
            <a href="/" className="hover:text-accent transition-colors font-medium">
              Home
            </a>
            <span className="text-white/60">/</span>
            <span className="text-white/90 font-medium">Shop</span>
          </nav>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-12">
        {/* Results header with mobile filter toggle */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">
              {queryParam
                ? `Search results for "${queryParam}"`
                : nice(category)}
            </h2>
            <p className="text-muted-foreground">
              Showing {pageItems.length} of {filtered.length} products
            </p>
          </div>

          {/* Mobile filter button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-6 bg-[hsl(var(--filter-bg))] rounded-2xl p-6 shadow-sm border border-border">
              <FilterSidebar />
            </div>
          </div>

          {/* Mobile filter drawer */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-background shadow-2xl overflow-y-auto animate-slide-in-right">
                <FilterSidebar isMobile />
              </div>
            </div>
          )}

          {/* ───── product grid ───── */}
          <main className="flex-1">
            {pageItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() => {
                    setCategory("all");
                    setMinPrice(0);
                    setMaxPrice(Infinity);
                    setSortBy("");
                  }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageItems.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}

            {/* pagination */}
            {pages > 1 && (
              <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2.5 rounded-lg border border-border font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`min-w-[44px] px-4 py-2.5 rounded-lg font-medium transition-all ${
                      page === i + 1
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border hover:bg-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pages))}
                  disabled={page === pages}
                  className="px-4 py-2.5 rounded-lg border border-border font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
