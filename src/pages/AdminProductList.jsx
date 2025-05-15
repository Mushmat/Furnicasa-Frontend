// src/pages/AdminProductList.jsx
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(data);
      } catch (err) { console.error(err); }
    })();
  }, []);

  /* --- filter by search text --- */
  const list = useMemo(
    () => products.filter(p => p.title.toLowerCase().includes(q.toLowerCase())),
    [products, q]
  );

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(p => p.filter(x => x._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-orange-600 text-white rounded px-4 py-2"
        >
          + New
        </Link>
      </div>

      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search…"
        className="w-full border rounded px-3 py-2 mb-4"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Img</th><th className="p-2">Title</th>
              <th className="p-2">Price</th><th className="p-2">Cat.</th>
              <th className="p-2 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-2">
                  <img src={p.imageUrl} alt="" className="w-12 h-12 object-cover rounded"/>
                </td>
                <td className="p-2">{p.title}</td>
                <td className="p-2">₹{p.price}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => nav(`/admin/products/${p._id}/edit`)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Del
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center">No products.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductList;
