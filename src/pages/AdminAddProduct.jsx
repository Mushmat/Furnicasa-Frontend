// src/pages/AdminAddProduct.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ImageDrop = ({ onUpload }) => {
  const [preview, setPreview] = useState(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: ([file]) => {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
      ${isDragActive ? "border-orange-400 bg-orange-50" : "border-gray-300"}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="preview" className="mx-auto h-40 object-contain" />
      ) : (
        <p className="text-gray-500">Drag & drop image here, or click to browse</p>
      )}
    </div>
  );
};

const CategorySelect = ({ value, onChange }) => {
  const [cats, setCats] = useState([]);
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/categories`);
        setCats(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    })();
  }, []);

  const addCategory = () => {
    if (newCat && !cats.includes(newCat)) {
      setCats([...cats, newCat]);
      onChange(newCat);
      setNewCat("");
    }
  };

  return (
    <>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-2"
      >
        <option value="">Select category…</option>
        {cats.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New category"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="button"
          onClick={addCategory}
          className="bg-gray-800 text-white px-4 rounded"
        >
          Add
        </button>
      </div>
    </>
  );
};

const AdminAddProduct = () => {
  const { user } = useAuth();
  const token     = localStorage.getItem("token");
  const navigate  = useNavigate();

  const [form, setForm]         = useState({ title:"", price:"", description:"", category:"", outOfStock: false });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState({ type:"", text:"" });

  if (!user?.isAdmin) return <p className="p-4">Access denied.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg({});

    try {
      let imageUrl = "";
      if (imageFile) {
        // example upload endpoint (expects FormData & returns { url })
        const fd = new FormData();
        fd.append("file", imageFile);
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/upload`,
          fd,
          { headers:{ Authorization:`Bearer ${token}`, "Content-Type":"multipart/form-data" } }
        );
        imageUrl = data.url;
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
        { ...form, imageUrl },
        { headers:{ Authorization:`Bearer ${token}` } }
      );

      setMsg({ type:"success", text:"Product added!" });
      setForm({ title:"", price:"", description:"", category:"", outOfStock: false });
      setImageFile(null);
      setTimeout(() => navigate("/admin/orders"), 1000); // go somewhere useful
    } catch (err) {
      setMsg({ type:"error", text: err.response?.data?.error || "Failed to add" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      {msg.text && (
        <p className={msg.type === "error" ? "text-red-600 mb-4" : "text-green-600 mb-4"}>
          {msg.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* title */}
        <input
          required
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title:e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        {/* price */}
        <input
          required
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price:e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        {/* description */}
        <textarea
          rows="4"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description:e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        {/* image uploader */}
        <ImageDrop onUpload={setImageFile} />

        {/* categories */}
        <CategorySelect
          value={form.category}
          onChange={(c) => setForm({ ...form, category:c })}
        />

        {/* out of stock toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.outOfStock}
            onChange={(e) => setForm({ ...form, outOfStock: e.target.checked })}
          />
          Mark as out of stock
        </label>

        <button
          disabled={saving}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
        >
          {saving ? "Saving…" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
