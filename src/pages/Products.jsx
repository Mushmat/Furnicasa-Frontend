import React, { useEffect, useState, useMemo } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  // — Data
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  // — Filters & view state
  const [category,  setCategory]  = useState('all');
  const [minPrice,  setMinPrice]  = useState(0);
  const [maxPrice,  setMaxPrice]  = useState(10000);
  const [sortBy,    setSortBy]    = useState('');
  const [page,      setPage]      = useState(1);

  // — Fetch products on mount
  useEffect(() => {
    fetchProducts()
      .then(data => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // — Build category list
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category || 'Uncategorized'));
    return ['all', ...cats];
  }, [products]);

  // — Filter, sort, paginate
  const perPage = 12;
  const filtered = useMemo(() => {
    let list = products;

    if (category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);

    if (sortBy === 'price_asc')  list = list.sort((a,b) => a.price - b.price);
    if (sortBy === 'price_desc') list = list.sort((a,b) => b.price - a.price);
    if (sortBy === 'name_asc')   list = list.sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === 'name_desc')  list = list.sort((a,b) => b.name.localeCompare(a.name));

    return list;
  }, [products, category, minPrice, maxPrice, sortBy]);

  const pages = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page-1)*perPage, page*perPage);

  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (error)   return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div id="main-wrapper" className="pt-[5.5rem]">

      {/* ====== Page Banner ====== */}
      <section
        className="page-banner-section bg-cover bg-center h-[330px] mb-12"
        style={{ backgroundImage: `url('/assets/images/bg/breadcrumb.png')` }}
      >
        <div className="container h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl font-bold">Shop</h1>
          <nav className="mt-2">
            <ol className="flex space-x-2 text-sm">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li>/</li>
              <li>Shop</li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-8">

        {/* ====== Sidebar ====== */}
        <aside className="lg:w-1/4 space-y-6">

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-2">Product categories</h3>
            <ul className="space-y-1">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-1 rounded ${
                      category === cat
                        ? 'bg-gray-800 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold mb-2">Filter by price</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={e => setMinPrice(Number(e.target.value))}
                  className="w-1/2 border px-2 py-1 rounded"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-1/2 border px-2 py-1 rounded"
                  placeholder="Max"
                />
              </div>
              <button className="btn w-full">Filter</button>
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold mb-2">Sort by</h3>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
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

        {/* ====== Product Grid ====== */}
        <main className="flex-1">
          {pageItems.length === 0 ? (
            <p>No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageItems.map(prod => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}

          {/* ====== Pagination ====== */}
          {pages > 1 && (
            <div className="mt-12 flex justify-center space-x-3">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i+1)}
                  className={`px-3 py-1 rounded ${
                    page === i+1
                      ? 'bg-gray-800 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {String(i+1).padStart(2,'0')}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(p+1, pages))}
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
};

export default Products;
