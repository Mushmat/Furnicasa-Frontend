// src/pages/AdminProductForm.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";

/* ---------- Image upload dropzone ---------- */
const ImageDrop = ({ initial, onSelect }) => {
  const [preview, setPre] = useState(initial);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: ([file]) => {
      setPre(URL.createObjectURL(file));
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

const AdminProductForm = () => {
  const { id } = useParams();                // undefined for “new”
  const isEdit = Boolean(id);
  const nav = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  /* form state */
  const [base, setBase] = useState({
    title: "",
    price: "",
    category: "",
  });
  const [specs, setSpecs] = useState([{ k: "", v: "" }]);
  const [specKeys, setSpecKeys] = useState([]);
  const [imageFile, setFile] = useState(null);
  const [imageUrl, setUrl] = useState("");
  const [cats, setCats] = useState([]);
  const [saving, setSaving] = useState(false);

  /* fetch cats, spec-keys, and product (if editing) */
  useEffect(() => {
    (async () => {
      try {
        const [{ data: c }, { data: keys }] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/categories`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/spec-keys`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCats(c);
        setSpecKeys(keys);
      } catch (e) {
        console.error("Failed to load categories or spec-keys", e);
      }

      if (isEdit) {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
          );
          const { title, price, category, imageUrl, specs } = data;
          setBase({ title, price, category });
          setUrl(imageUrl);
          setSpecs(
            Object.entries(specs || {}).map(([k, v]) => ({ k, v })) || [
              { k: "", v: "" },
            ]
          );
        } catch (e) {
          console.error("Failed to load product", e);
        }
      }
    })();
  }, [id, isEdit, token]);

  /* on “new” mode, seed rows from known keys */
  useEffect(() => {
    if (!isEdit && specKeys.length) {
      setSpecs(specKeys.map((k) => ({ k, v: "" })));
    }
  }, [isEdit, specKeys]);

  if (!user?.isAdmin) return <p className="p-4">Access denied.</p>;

  /* spec-row handlers */
  const changeSpec = (idx, field, val) =>
    setSpecs((s) =>
      s.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
    );
  const addRow = () => setSpecs((s) => [...s, { k: "", v: "" }]);
  const delRow = (i) => setSpecs((s) => s.filter((_, idx) => idx !== i));

  /* save handler */
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalUrl = imageUrl;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
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
        .filter((r) => r.k && r.v)
        .reduce((acc, { k, v }) => ({ ...acc, [k]: v }), {});

      const payload = { ...base, imageUrl: finalUrl, specs: specObj };

      if (isEdit) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      nav("/admin/products");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <form onSubmit={save} className="space-y-4">
        {/* Title */}
        <input
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={base.title}
          onChange={(e) => setBase({ ...base, title: e.target.value })}
        />

        {/* Price */}
        <input
          required
          type="number"
          className="w-full border rounded px-3 py-2"
          placeholder="Price ₹"
          value={base.price}
          onChange={(e) => setBase({ ...base, price: e.target.value })}
        />

        {/* Category */}
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
            onClick={() => {
              const n = prompt("New category name");
              if (n) {
                setCats([...cats, n]);
                setBase({ ...base, category: n });
              }
            }}
            className="px-4 rounded bg-gray-800 text-white"
          >
            Add
          </button>
        </div>

        {/* Image */}
        <ImageDrop initial={imageUrl} onSelect={setFile} />

        {/* Specs */}
        <datalist id="spec-keys">
          {specKeys.map((key) => (
            <option key={key} value={key} />
          ))}
        </datalist>
        <div className="border rounded p-4">
          <p className="font-medium mb-2">Product Specs</p>
          {specs.map((row, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                placeholder="Label"
                list="spec-keys"
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

        {/* Submit */}
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
