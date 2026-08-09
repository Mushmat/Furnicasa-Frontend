// src/pages/AdminContacts.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Search, MessagesSquare, Reply } from "lucide-react";

import AdminShell from "../components/ui/AdminShell";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/Bits";
import { EASE } from "../components/ui/motion";

export default function AdminContacts() {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMsgs(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return msgs;
    return msgs.filter(
      (m) =>
        m.name?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query) ||
        m.message?.toLowerCase().includes(query)
    );
  }, [msgs, q]);

  return (
    <AdminShell
      title="Messages"
      subtitle={`${msgs.length} submission${msgs.length === 1 ? "" : "s"} from the contact form`}
    >
      <div className="relative mb-6 max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email or message…"
          aria-label="Search messages"
          className="input pl-11"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-3xl" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title={msgs.length === 0 ? "No messages yet" : "Nothing matches that search"}
          description={
            msgs.length === 0
              ? "Enquiries sent through the contact form will land here."
              : "Try a different name or keyword."
          }
        />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {list.map((m, i) => (
            <motion.li
              key={m._id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 8) * 0.05 }}
              className="flex flex-col rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-sm font-semibold text-sand-50">
                  {(m.name || "?").charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-900">{m.name}</p>
                  <a
                    href={`mailto:${m.email}`}
                    className="truncate text-sm text-clay-600 hover:underline"
                  >
                    {m.email}
                  </a>
                </div>

                <time className="shrink-0 text-xs text-ink-400">
                  {new Date(m.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </time>
              </div>

              <p className="flex-1 whitespace-pre-line rounded-2xl bg-sand-100/70 p-4 text-sm leading-relaxed text-ink-700">
                {m.message}
              </p>

              <a
                href={`mailto:${m.email}?subject=Re: your Furnicasa enquiry`}
                className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-ink-700 transition-colors hover:text-clay-600"
              >
                <Reply size={15} />
                Reply by email
              </a>
            </motion.li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
