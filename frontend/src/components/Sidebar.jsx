import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = {
  business: [
    { path: "/", label: "📊 Dashboard" },
    { path: "/upload", label: "📤 Upload Files" },
    { path: "/results", label: "📋 Results" },
  ],
  admin: [{ path: "/admin", label: "🛡️ Admin Panel" }],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const items = navItems[user?.role] || [];

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">GST Reconciler</h1>
        <p className="text-sm text-gray-400 mt-1">{user?.name}</p>
        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full capitalize">
          {user?.role}
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
