// src/pages/AdminProductForm.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";

/* ───────────────────────── image drop ───────────────────────── */
const ImageDrop = ({ initial, onSelect }) => {
  const [preview, setPreview] = useState(initial);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: ([file]) => {
      setPreview(URL.createObjectURL(file));
      onSelect(file);
    },
  });
  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer border-gray-300"
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="" className="h-40 mx-auto object-contain" />
      ) : (
        <p className="text-gray-500">Drag & drop image or click to browse</p>
      )}
    </div>
  );
};
/* ────────────────────────────────────────────────────────────── */

const AdminProductForm = () => {
  const { id }    = useParams();
  const isEdit    = Boolean(id);
  const nav       = useNavigate();
  const { user }  = useAuth();
  const token     = localStorage.getItem("token");

  /* base fields + discount */
  const [base, setBase] = useState({
    title: "", price: "", category: "", discountPercent: 0,
  });

  const [specs, setSpecs]     = useState([{ k: "", v: "" }]);
  const [specKeys, setKeys]   = useState([]);
  const [cats, setCats]       = useState([]);
  const [imgFile, setFile]    = useState(null);
  const [imgUrl,  setUrl]     = useState("");
  const [saving,  setSaving]  = useState(false);

  /* load cats, keys, product */
  useEffect(() => {
    (async () => {
      try {
        const [{ data: c }, { data: k }] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/categories`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/spec-keys`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCats(c);  setKeys(k);
      } catch (e) { console.error(e); }

      if (isEdit)
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
          );
          const { title, price, category, imageUrl, specs, discountPercent = 0 } = data;
          setBase({ title, price, category, discountPercent });
          setUrl(imageUrl);
          setSpecs(
            Object.entries(specs || {}).map(([k, v]) => ({ k, v })) || [
              { k: "", v: "" },
            ]
          );
        } catch (e) { console.error(e); }
    })();
  }, [id, isEdit, token]);

  /* seed on new */
  useEffect(() => {
    if (!isEdit && specKeys.length) setSpecs(specKeys.map((k) => ({ k, v: "" })));
  }, [isEdit, specKeys]);

  if (!user?.isAdmin) return <p className="p-4">Access denied.</p>;

  /* spec helpers */
  const changeSpec = (i, f, v) =>
    setSpecs((s) => s.map((row, idx) => (idx === i ? { ...row, [f]: v } : row)));
  const addRow = () => setSpecs((s) => [...s, { k: "", v: "" }]);
  const delRow = (i) => setSpecs((s) => s.filter((_, idx) => idx !== i));

  /* save */
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalUrl = imgUrl;
      if (imgFile) {
        const fd = new FormData();
        fd.append("file", imgFile);
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/upload`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        finalUrl = data.url;
      }

      const specObj = specs
        .filter(({ k, v }) => k && v)
        .reduce((acc, { k, v }) => ({ ...acc, [k]: v }), {});

      const payload = { ...base, imageUrl: finalUrl, specs: specObj };

      if (isEdit)
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      else
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

      nav("/admin/products");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  /* render */
  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <form onSubmit={save} className="space-y-4">
        <input
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={base.title}
          onChange={(e) => setBase({ ...base, title: e.target.value })}
        />

        <input
          required
          type="number"
          className="w-full border rounded px-3 py-2"
          placeholder="List Price ₹"
          value={base.price}
          onChange={(e) => setBase({ ...base, price: e.target.value })}
        />

        <input
          type="number"
          min="0"
          max="90"
          className="w-full border rounded px-3 py-2"
          placeholder="Discount %"
          value={base.discountPercent}
          onChange={(e) =>
            setBase({ ...base, discountPercent: e.target.value })
          }
        />

        <div className="flex gap-2">
          <select
            className="flex-1 border rounded px-3 py-2"
            value={base.category}
            onChange={(e) => setBase({ ...base, category: e.target.value })}
          >
            <option value="">Select category…</option>
            {cats.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            type="button"
            className="px-4 rounded bg-gray-800 text-white"
            onClick={() => {
              const n = prompt("New category name");
              if (n) {
                setCats([...cats, n]);
                setBase({ ...base, category: n });
              }
            }}
          >
            Add
          </button>
        </div>

        <ImageDrop initial={imgUrl} onSelect={setFile} />

        <datalist id="spec-keys">
          {specKeys.map((k) => (
            <option key={k} value={k} />
          ))}
        </datalist>

        <div className="border rounded p-4">
          <p className="font-medium mb-2">Product Specs</p>
          {specs.map((row, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                list="spec-keys"
                placeholder="Label"
                className="flex-1 border rounded px-2 py-1"
                value={row.k}
                onChange={(e) => changeSpec(i, "k", e.target.value)}
              />
              <input
                placeholder="Value"
                className="flex-1 border rounded px-2 py-1"
                value={row.v}
                onChange={(e) => changeSpec(i, "v", e.target.value)}
              />
              {specs.length > 1 && (
                <button
                  type="button"
                  onClick={() => delRow(i)}
                  className="px-2 text-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="text-blue-600 text-sm"
          >
            + Add row
          </button>
        </div>

        <button
          disabled={saving}
          className="w-full bg-orange-600 text-white py-2 rounded"
        >
          {saving ? "Saving…" : isEdit ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
