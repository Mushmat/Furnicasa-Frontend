// src/pages/Products.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  // — Data state
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  // — UI state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption,       setSortOption]       = useState('');
  const [viewMode,         setViewMode]         = useState('grid'); // 'grid' or 'list'

  // — Fetch once on mount
  useEffect(() => {
    fetchProducts()
      .then(data => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // — Derive unique categories (plus an "all" option)
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category || 'uncategorized'));
    return ['all', ...cats];
  }, [products]);

  // — Filter & sort
  const displayed = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (sortOption === 'price_asc') {
      list.sort((a,b) => a.price - b.price);
    } else if (sortOption === 'price_desc') {
      list.sort((a,b) => b.price - a.price);
    } else if (sortOption === 'name_asc') {
      list.sort((a,b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name_desc') {
      list.sort((a,b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [products, selectedCategory, sortOption]);

  if (loading) return <p className="p-6 text-center">Loading products…</p>;
  if (error)   return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* — Sidebar */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div>
            <h3 className="font-bold mb-2">Product categories</h3>
            <ul className="space-y-1">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    className={`w-full text-left px-2 py-1 rounded ${
                      selectedCategory === cat
                        ? 'bg-gray-800 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">Sort by</h3>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="">— Select —</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="name_asc">Name: A → Z</option>
              <option value="name_desc">Name: Z → A</option>
            </select>
          </div>

          <div>
            <h3 className="font-bold mb-2">View</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-2 py-1 rounded ${
                  viewMode === 'grid'
                    ? 'bg-gray-800 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-2 py-1 rounded ${
                  viewMode === 'list'
                    ? 'bg-gray-800 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </aside>

        {/* — Products */}
        <main className="flex-1">
          {displayed.length === 0 ? (
            <p>No products found.</p>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <ul className="space-y-6">
              {displayed.map(p => (
                <li
                  key={p._id}
                  className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-4 border rounded"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full md:w-48 h-48 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                    <p className="text-gray-600 mb-2">{p.description}</p>
                    <p className="font-semibold text-lg">${p.price.toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
