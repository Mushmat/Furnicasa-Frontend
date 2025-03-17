// src/pages/AdminDashboard.jsx
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <Link to="/admin/orders" className="text-blue-600 hover:underline">
            Manage Orders
          </Link>
        </li>
        {/* You can add more admin links here, like products management */}
      </ul>
    </div>
  );
};

export default AdminDashboard;
