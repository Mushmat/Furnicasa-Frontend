// src/pages/AdminContacts.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminContacts() {
  const [msgs, setMsgs] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/contact`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => setMsgs(res.data))
    .catch(console.error);
  }, [token]);

  if (!msgs.length) return <p className="p-6 text-center">No messages yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Form Submissions</h1>
      <ul className="space-y-4">
        {msgs.map(m => (
          <li key={m._id} className="border p-4 rounded">
            <p><strong>{m.name}</strong> (<a className="text-blue-600" href={`mailto:${m.email}`}>{m.email}</a>)</p>
            <p className="text-gray-600 text-sm">{new Date(m.createdAt).toLocaleString()}</p>
            <p className="mt-2">{m.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
