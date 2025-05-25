import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { fetchProducts } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  /* ───── routing state ───── */
  const location   = useLocation();
  const queryParam =
    new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  const startCat = (location.state?.category || "All").toLowerCase();

  /* ───── data state ───── */
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  /* ───── ui / filter state ───── */
  const [category,  setCategory]  = useState(startCat);
  const [minPrice,  setMinPrice]  = useState(0);
  const [maxPrice,  setMaxPrice]  = useState(Infinity);
  const [sortBy,    setSortBy]    = useState("");
  const [page,      setPage]      = useState(1);

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
      price_asc:  (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      name_asc:   (a, b) => a.title.localeCompare(b.title),
      name_desc:  (a, b) => b.title.localeCompare(a.title),
    };
    if (sortBy) list.sort(sorters[sortBy]);

    return list;
  }, [products, category, minPrice, maxPrice, sortBy, queryParam]);

  const pages     = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* guards */
  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (error)   return <p className="p-8 text-center text-red-600">{error}</p>;

  /* helper */
  const nice = (cat) =>
    cat === "all"
      ? "All"
      : cat.replace(/\b\w/g, (c) => c.toUpperCase());

  /* ───── render ───── */
  return (
    <div id="main-wrapper">
      {/* banner */}
      <section
        className="page-banner-section bg-cover bg-center h-[330px] mb-12"
        style={{ backgroundImage: "url('/assets/images/bg/breadcrumb.png')" }}
      >
        <div className="container h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl font-bold">Shop</h1>
          <nav className="mt-2">
            <ol className="flex space-x-2 text-sm">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>/</li>
              <li>Shop</li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-8">
        {/* ───── sidebar (narrower) ───── */}
        <aside className="lg:w-1/5 space-y-6">
          {/* categories */}
          <div>
            <h3 className="font-semibold mb-2">Product categories</h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setCategory(cat);
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-1 rounded ${
                      category === cat
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {nice(cat)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* price filter */}
          <div>
            <h3 className="font-semibold mb-2">Filter by price</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-1/2 border px-2 py-1 rounded"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={maxPrice === Infinity ? "" : maxPrice}
                  onChange={(e) => {
                    const v = e.target.value;
                    setMaxPrice(v === "" ? Infinity : Number(v));
                  }}
                  className="w-1/2 border px-2 py-1 rounded"
                  placeholder="Max"
                />
              </div>

               <button
                 className="btn w-full py-1 text-sm"
                 onClick={() => setPage(1)}
               >                
               Apply filter
              </button>

              + <button
                   className="btn w-full py-1 text-sm"
                   onClick={() => {
                     setMinPrice(0);
                     setMaxPrice(Infinity);
                     setPage(1);
                   }}
                 >
                Clear filter
              </button>
            </div>
          </div>

          {/* sort */}
          <div>
            <h3 className="font-semibold mb-2">Sort by</h3>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full border px-3 py-1 rounded"
            >
              <option value="">Default</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="name_asc">Name: A → Z</option>
              <option value="name_desc">Name: Z → A</option>
            </select>
          </div>
        </aside>

        {/* ───── product grid ───── */}
        <main className="flex-1">
          {pageItems.length === 0 ? (
            <p>No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageItems.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}

          {/* pagination */}
          {pages > 1 && (
            <div className="mt-12 flex justify-center space-x-3">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pages))}
                className="px-3 py-1 hover:bg-gray-100 rounded"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
