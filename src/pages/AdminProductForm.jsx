// src/pages/AdminProductForm.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useDropzone } from "react-dropzone";

/* -------------- helpers reused from your Add-product page -------------- */
const ImageDrop = ({ existing, onUpload }) => {
  const [preview, setPreview] = useState(existing || null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] }, multiple: false,
    onDrop: ([file]) => { setPreview(URL.createObjectURL(file)); onUpload(file); }
  });
  return (
    <div {...getRootProps()}
         className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer border-gray-300">
      <input {...getInputProps()} />
      {preview
        ? <img src={preview} alt="" className="mx-auto h-40 object-contain"/>
        : <p className="text-gray-500">Drag & drop image or click to browse</p>}
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
      } catch { /* ignore */ }
    })();
  }, []);
  const add = () => {
    if (newCat && !cats.includes(newCat)) { setCats([...cats, newCat]); onChange(newCat); setNewCat(""); }
  };
  return (
    <>
      <select value={value} onChange={e=>onChange(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2">
        <option value="">Select category…</option>
        {cats.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="flex gap-2">
        <input value={newCat}
               onChange={e=>setNewCat(e.target.value)}
               placeholder="New category"
               className="flex-1 border rounded px-3 py-2"/>
        <button type="button" onClick={add}
                className="bg-gray-800 text-white px-4 rounded">Add</button>
      </div>
    </>
  );
};
/* ----------------------------------------------------------------------- */

const AdminProductForm = () => {
  const { id } = useParams();          // undefined when creating
  const isEdit  = Boolean(id);
  const { user } = useAuth();
  const token   = localStorage.getItem("token");
  const nav     = useNavigate();

  const [form, setForm]       = useState({ title:"", price:"", description:"", category:"" });
  const [imageFile, setFile]  = useState(null);
  const [imageUrl, setUrl]    = useState("");
  const [saving, setSaving]   = useState(false);

  /* preload for edit */
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
        const { title, price, description, category, imageUrl } = data;
        setForm({ title, price, description, category });
        setUrl(imageUrl);
      } catch (err) { console.error(err); }
    })();
  }, [isEdit, id]);

  if (!user?.isAdmin) return <p className="p-4">Access denied.</p>;

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      let finalUrl = imageUrl;
      if (imageFile) {
        const fd = new FormData(); fd.append("file", imageFile);
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/upload`,
          fd,
          { headers:{ Authorization:`Bearer ${token}`, "Content-Type":"multipart/form-data" } }
        );
        finalUrl = data.url;
      }

      const payload = { ...form, imageUrl: finalUrl };
      if (isEdit) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,
                        payload, { headers:{ Authorization:`Bearer ${token}` } });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
                         payload, { headers:{ Authorization:`Bearer ${token}` } });
      }
      nav("/admin/products");
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h1>
      <form onSubmit={submit} className="space-y-4">
        <input required value={form.title}
               onChange={e=>setForm({...form, title:e.target.value})}
               placeholder="Title" className="w-full border rounded px-3 py-2"/>
        <input required type="number" value={form.price}
               onChange={e=>setForm({...form, price:e.target.value})}
               placeholder="Price (₹)" className="w-full border rounded px-3 py-2"/>
        <textarea rows="4" value={form.description}
                  onChange={e=>setForm({...form, description:e.target.value})}
                  placeholder="Description" className="w-full border rounded px-3 py-2"/>
        <ImageDrop existing={imageUrl} onUpload={setFile}/>
        <CategorySelect value={form.category} onChange={c=>setForm({...form, category:c})}/>
        <button disabled={saving}
                className="w-full bg-orange-600 text-white py-2 rounded">
          {saving ? "Saving…" : isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
