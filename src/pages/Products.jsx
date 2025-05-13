// src/pages/Products.jsx
import React, { useEffect, useState, useMemo } from 'react'
import { fetchProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import { FaTh, FaThList } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Products = () => {
  // fetched data + loading / error
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  // UI state
  const [view, setView]             = useState('grid')      // 'grid' | 'list'
  const [sortOption, setSortOption] = useState('')          // '', 'name-asc', 'price-desc', etc.
  const [page, setPage]             = useState(1)
  const perPage                     = 12

  // filter state
  const [selectedCats, setSelectedCats] = useState([])      
  const [priceFilter, setPriceFilter]   = useState([0, Infinity])

  // fetch on mount
  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data)
        // initialize priceFilter based on your data range
        const prices = data.map(p => p.price)
        setPriceFilter([Math.min(...prices), Math.max(...prices)])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6">Loading products…</p>
  if (error)   return <p className="p-6 text-red-500">{error}</p>

  // derive the list of categories
  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))),
    [products]
  )

  // filtering + sorting + pagination
  const processed = useMemo(() => {
    let result = products

    // 1) category filter
    if (selectedCats.length) {
      result = result.filter(p => selectedCats.includes(p.category))
    }

    // 2) price filter
    result = result.filter(
      p => p.price >= priceFilter[0] && p.price <= priceFilter[1]
    )

    // 3) sorting
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':   return a.name.localeCompare(b.name)
        case 'name-desc':  return b.name.localeCompare(a.name)
        case 'price-asc':  return a.price - b.price
        case 'price-desc': return b.price - a.price
        default:           return 0
      }
    })

    return result
  }, [products, selectedCats, priceFilter, sortOption])

  const totalPages = Math.ceil(processed.length / perPage)
  const paginated  = processed.slice((page - 1) * perPage, page * perPage)

  // handlers
  const toggleCat = cat =>
    setSelectedCats(cs =>
      cs.includes(cat) ? cs.filter(x => x !== cat) : [...cs, cat]
    )

  return (
    <div className="container mx-auto p-6 flex gap-6">
      {/* ───────────── SIDEBAR ───────────── */}
      <aside className="w-1/4 space-y-8">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold mb-2">Categories</h3>
          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat}>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(cat)}
                    onChange={() => toggleCat(cat)}
                    className="form-checkbox h-4 w-4"
                  />
                  <span className="capitalize">{cat}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div>
          <h3 className="text-lg font-bold mb-2">Price</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              className="w-1/3 border p-1 rounded"
              value={priceFilter[0]}
              onChange={e =>
                setPriceFilter([Number(e.target.value), priceFilter[1]])
              }
            />
            <span>–</span>
            <input
              type="number"
              className="w-1/3 border p-1 rounded"
              value={priceFilter[1]}
              onChange={e =>
                setPriceFilter([priceFilter[0], Number(e.target.value)])
              }
            />
          </div>
        </div>
      </aside>

      {/* ───────────── MAIN CONTENT ───────────── */}
      <main className="flex-1">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            {/* view toggle */}
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded ${
                view === 'grid' ? 'bg-gray-200' : ''
              }`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded ${
                view === 'list' ? 'bg-gray-200' : ''
              }`}
            >
              <FaThList />
            </button>
            <span>{processed.length} items</span>
          </div>

          {/* sort */}
          <div>
            <label className="mr-2 font-medium">Sort by:</label>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">Default</option>
              <option value="name-asc">Name, A–Z</option>
              <option value="name-desc">Name, Z–A</option>
              <option value="price-asc">Price, low→high</option>
              <option value="price-desc">Price, high→low</option>
            </select>
          </div>
        </div>

        {/* Products Grid or List */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {paginated.map(p => (
              <div
                key={p._id}
                className="flex border rounded overflow-hidden shadow-sm"
              >
                <Link
                  to={`/product/${p._id}`}
                  className="w-1/3 flex-shrink-0"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <Link
                    to={`/product/${p._id}`}
                    className="text-xl font-semibold hover:underline"
                  >
                    {p.name}
                  </Link>
                  <p className="text-gray-700 line-clamp-3">
                    {p.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">
                      ${p.price.toFixed(2)}
                    </span>
                    <Link
                      to={`/product/${p._id}`}
                      className="btn bg-black text-white px-4 py-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-4 py-2 border rounded ${
                page === n ? 'bg-gray-900 text-white' : ''
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Products
