import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axiosInstance";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/admin/users").then(({ data }) => setUsers(data));
    api.get("/admin/stats").then(({ data }) => setStats(data));
  }, []);

  const toggle = async (id) => {
    await api.patch(`/admin/users/${id}/toggle`);
    setUsers((u) =>
      u.map((usr) =>
        usr._id === id ? { ...usr, isActive: !usr.isActive } : usr,
      ),
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            ["Total Users", stats.totalUsers, "bg-blue-500"],
            ["Reconciliations", stats.totalReconciliations, "bg-green-500"],
            ["Total Mismatches", stats.totalMismatches, "bg-red-500"],
            ["High Risk", stats.highRiskCount, "bg-yellow-500"],
          ].map(([label, value, color]) => (
            <div
              key={label}
              className={`${color} text-white rounded-xl p-5 shadow`}
            >
              <p className="text-sm opacity-80">{label}</p>
              <p className="text-3xl font-bold mt-1">{value ?? 0}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                {["Name", "Email", "Business", "GSTIN", "Status", "Action"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.businessId?.businessName || "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {user.businessId?.gstin || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggle(user._id)}
                      className={`px-3 py-1 rounded text-xs font-medium text-white ${user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
