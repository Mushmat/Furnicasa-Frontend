// src/pages/AdminProductForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import {
  UploadCloud,
  X,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  Lock,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import AdminShell from "../components/ui/AdminShell";
import { EmptyState, inr } from "../components/ui/Bits";
import { EASE, spring } from "../components/ui/motion";

/* ── image drop zone ──────────────────────────────────────── */
function ImageDrop({ initial, onSelect }) {
  const [preview, setPreview] = useState(initial);

  useEffect(() => setPreview(initial), [initial]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: ([file]) => {
      if (!file) return;
      setPreview(URL.createObjectURL(file));
      onSelect(file);
    },
  });

  const clearImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onSelect(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
        isDragActive
          ? "border-clay-500 bg-clay-50"
          : "border-ink-200 bg-sand-100/50 hover:border-ink-300"
      }`}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <img
              src={preview}
              alt="Product preview"
              className="mx-auto h-44 rounded-xl object-contain"
            />
            <button
              type="button"
              onClick={clearImage}
              title="Remove image"
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-white transition-colors hover:bg-clay-600"
            >
              <X size={15} />
            </button>
            <p className="mt-3 text-xs text-ink-400">
              Click or drop another image to replace it
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8"
          >
            <motion.span
              animate={isDragActive ? { y: -6 } : { y: 0 }}
              transition={spring}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ink-500 shadow-soft"
            >
              <UploadCloud size={24} />
            </motion.span>
            <p className="font-medium text-ink-700">
              {isDragActive ? "Drop it here" : "Drag & drop an image"}
            </p>
            <p className="mt-1 text-sm text-ink-400">or click to browse</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── page ─────────────────────────────────────────────────── */
export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nav = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const token = localStorage.getItem("token");

  const [base, setBase] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    discountPercent: 0,
    outOfStock: false,
  });

  const [specs, setSpecs] = useState([{ k: "", v: "" }]);
  const [specKeys, setKeys] = useState([]);
  const [cats, setCats] = useState([]);
  const [imgFile, setFile] = useState(null);
  const [imgUrl, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: c }, { data: k }] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/categories`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/spec-keys`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCats(Array.isArray(c) ? c : []);
        setKeys(Array.isArray(k) ? k : []);
      } catch (e) {
        console.error(e);
      }

      if (isEdit) {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
          );
          const {
            title,
            price,
            category,
            description = "",
            imageUrl,
            specs: loadedSpecs,
            discountPercent = 0,
            outOfStock = false,
          } = data;

          setBase({ title, price, category, description, discountPercent, outOfStock });
          setUrl(imageUrl);

          const rows = Object.entries(loadedSpecs || {}).map(([k, v]) => ({ k, v }));
          setSpecs(rows.length ? rows : [{ k: "", v: "" }]);
        } catch (e) {
          console.error(e);
          toast.error("Could not load that product.");
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit, token]);

  /* seed the spec rows for a brand-new product */
  useEffect(() => {
    if (!isEdit && specKeys.length) setSpecs(specKeys.map((k) => ({ k, v: "" })));
  }, [isEdit, specKeys]);

  if (!user?.isAdmin) {
    return (
      <AdminShell title="Admin">
        <EmptyState
          icon={Lock}
          title="Access denied"
          description="You need an admin account to open this page."
          action={
            <Link to="/" className="btn-primary">
              Back to the store
            </Link>
          }
        />
      </AdminShell>
    );
  }

  const changeSpec = (i, f, v) =>
    setSpecs((s) => s.map((row, idx) => (idx === i ? { ...row, [f]: v } : row)));
  const addRow = () => setSpecs((s) => [...s, { k: "", v: "" }]);
  const delRow = (i) => setSpecs((s) => s.filter((_, idx) => idx !== i));

  const finalPrice = Math.round(
    (Number(base.price) || 0) * (1 - (Number(base.discountPercent) || 0) / 100)
  );

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

      toast.success(isEdit ? "Product updated" : "Product added");
      nav("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save the product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title={isEdit ? "Edit product" : "Add product"}
      subtitle={
        isEdit
          ? "Changes go live on the storefront as soon as you save."
          : "New products appear in the catalogue immediately."
      }
      action={
        <Link to="/admin/products" className="btn-ghost">
          <ArrowLeft size={16} />
          Back to products
        </Link>
      }
    >
      <motion.form
        onSubmit={save}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start"
      >
        {/* ── main column ── */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-ink-100 bg-white p-7 shadow-soft">
            <h2 className="mb-6 font-display text-lg font-semibold">Basics</h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="title" className="label">
                  Title
                </label>
                <input
                  id="title"
                  required
                  className="input"
                  placeholder="e.g. Solid teak three-seater sofa"
                  value={base.title}
                  onChange={(e) => setBase({ ...base, title: e.target.value })}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="label">
                    List price (₹)
                  </label>
                  <input
                    id="price"
                    required
                    type="number"
                    min="0"
                    className="input"
                    placeholder="0"
                    value={base.price}
                    onChange={(e) => setBase({ ...base, price: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="discount" className="label">
                    Discount (%)
                  </label>
                  <input
                    id="discount"
                    type="number"
                    min="0"
                    max="90"
                    className="input"
                    placeholder="0"
                    value={base.discountPercent}
                    onChange={(e) =>
                      setBase({ ...base, discountPercent: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="label">
                  Category
                </label>
                <div className="flex gap-2">
                  <select
                    id="category"
                    className="select flex-1"
                    value={base.category}
                    onChange={(e) => setBase({ ...base, category: e.target.value })}
                  >
                    <option value="">Select a category…</option>
                    {cats.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-ink btn-sm shrink-0 px-5"
                    onClick={() => {
                      const n = prompt("New category name");
                      if (n) {
                        setCats([...cats, n]);
                        setBase({ ...base, category: n });
                      }
                    }}
                  >
                    <Plus size={15} />
                    New
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  className="input resize-none"
                  placeholder="Materials, dimensions, the story behind the piece…"
                  value={base.description}
                  onChange={(e) => setBase({ ...base, description: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* specs */}
          <section className="rounded-3xl border border-ink-100 bg-white p-7 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                Specifications
              </h2>
              <button type="button" onClick={addRow} className="btn-ghost btn-sm">
                <Plus size={14} />
                Add row
              </button>
            </div>

            <datalist id="spec-keys">
              {specKeys.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {specs.map((row, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="flex gap-2"
                  >
                    <input
                      list="spec-keys"
                      placeholder="Label — e.g. Material"
                      className="input flex-1 py-2.5 text-sm"
                      value={row.k}
                      onChange={(e) => changeSpec(i, "k", e.target.value)}
                      aria-label={`Spec ${i + 1} label`}
                    />
                    <input
                      placeholder="Value — e.g. Solid teak"
                      className="input flex-1 py-2.5 text-sm"
                      value={row.v}
                      onChange={(e) => changeSpec(i, "v", e.target.value)}
                      aria-label={`Spec ${i + 1} value`}
                    />
                    {specs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => delRow(i)}
                        aria-label="Remove this spec"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink-400 transition-colors hover:bg-clay-50 hover:text-clay-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* ── sidebar ── */}
        <div className="space-y-6 lg:sticky lg:top-8">
          <section className="rounded-3xl border border-ink-100 bg-white p-7 shadow-soft">
            <h2 className="mb-5 font-display text-lg font-semibold">Image</h2>
            <ImageDrop initial={imgUrl} onSelect={setFile} />
          </section>

          <section className="rounded-3xl border border-ink-100 bg-white p-7 shadow-soft">
            <h2 className="mb-5 font-display text-lg font-semibold">
              Availability
            </h2>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="checkbox mt-0.5"
                checked={base.outOfStock}
                onChange={(e) => setBase({ ...base, outOfStock: e.target.checked })}
              />
              <span className="text-sm">
                <span className="font-medium text-ink-900">
                  Mark as out of stock
                </span>
                <span className="mt-0.5 block text-ink-400">
                  Customers can still see the product but can't add it to a cart.
                </span>
              </span>
            </label>

            {base.price !== "" && (
              <div className="mt-6 rounded-2xl bg-sand-100 p-4">
                <p className="label mb-1">Customers will pay</p>
                <p className="font-display text-2xl font-semibold text-ink-900">
                  {inr(finalPrice)}
                </p>
                {Number(base.discountPercent) > 0 && (
                  <p className="mt-1 text-xs text-ink-400">
                    down from {inr(base.price)}
                  </p>
                )}
              </div>
            )}
          </section>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary btn-sheen w-full btn-lg"
          >
            {saving ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Saving…
              </>
            ) : isEdit ? (
              "Update product"
            ) : (
              "Add product"
            )}
          </button>
        </div>
      </motion.form>
    </AdminShell>
  );
}
