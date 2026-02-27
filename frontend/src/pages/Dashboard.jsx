import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MetricCard from "../components/MetricCard";
import MismatchTable from "../components/MismatchTable";
import BarChartComponent from "../components/BarChart";
import PieChartComponent from "../components/PieChart";
import api from "../api/axiosInstance";

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/reconciliation/results")
      .then(({ data }) => {
        setResults(data);
        if (data.length > 0) setSelected(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const barData = selected
    ? [
        { name: "Matched", count: selected.matchedCount },
        { name: "Mismatched", count: selected.mismatchedCount },
        { name: "Missing", count: selected.missingInGSTR2B },
      ]
    : [];

  const pieData = selected?.details
    ? Object.entries(
        selected.details.reduce((acc, item) => {
          const key = item.riskFlag || "None";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {}),
      ).map(([name, value]) => ({ name, value }))
    : [];

  const renderLoading = () => (
    <div className="text-center py-24 text-gray-400">
      <p className="text-5xl mb-4">⏳</p>
      <p className="text-lg">Loading dashboard...</p>
    </div>
  );

  const renderEmpty = () => (
    <div className="text-center py-24 text-gray-400">
      <p className="text-6xl mb-4">📂</p>
      <p className="text-lg font-medium text-gray-600">
        No reconciliation data found
      </p>
      <p className="text-sm mt-2">
        Upload your GSTR-1 and GSTR-2B files, then run reconciliation.
      </p>
      <button
        onClick={() => navigate("/upload")}
        className="inline-block mt-5 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Go to Upload →
      </button>
    </div>
  );

  const renderDashboard = () => (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Invoices"
          value={selected.totalInvoices}
          subtitle="Uploaded in GSTR-1"
          color="blue"
        />
        <MetricCard
          title="Matched"
          value={selected.matchedCount}
          subtitle="Fully reconciled"
          color="green"
        />
        <MetricCard
          title="Mismatched"
          value={selected.mismatchedCount}
          subtitle="Value differences found"
          color="red"
        />
        <MetricCard
          title="ITC Difference"
          value={`₹${selected.itcDifference?.toLocaleString("en-IN")}`}
          subtitle={`Risk Level: ${selected.riskLevel}`}
          color={
            selected.riskLevel === "High"
              ? "red"
              : selected.riskLevel === "Medium"
                ? "yellow"
                : "green"
          }
        />
      </div>

      <div
        className={`rounded-xl p-4 mb-8 flex items-center gap-3 text-sm font-medium shadow-sm ${
          selected.riskLevel === "High"
            ? "bg-red-50 border border-red-200 text-red-700"
            : selected.riskLevel === "Medium"
              ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
              : "bg-green-50 border border-green-200 text-green-700"
        }`}
      >
        <span className="text-xl">
          {selected.riskLevel === "High"
            ? "🔴"
            : selected.riskLevel === "Medium"
              ? "🟡"
              : "🟢"}
        </span>
        <span>
          Overall Risk Level for <strong>{selected.filingPeriod}</strong> is{" "}
          <strong>{selected.riskLevel}</strong>.{" "}
          {selected.riskLevel === "High"
            ? "Immediate attention required."
            : selected.riskLevel === "Medium"
              ? "Some discrepancies detected."
              : "All invoices are within acceptable limits."}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 text-base">
            Invoice Status Breakdown
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">
            Matched vs Mismatched vs Missing
          </p>
          <BarChartComponent data={barData} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 text-base">
            Risk Distribution
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">
            Invoice count by risk level
          </p>
          <PieChartComponent data={pieData} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-sm text-gray-400">Missing in GSTR-2B</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">
            {selected.missingInGSTR2B}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Invoices not found in GSTR-2B
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-sm text-gray-400">Match Rate</p>
          <p className="text-3xl font-bold text-blue-500 mt-1">
            {selected.totalInvoices > 0
              ? `${Math.round(
                  (selected.matchedCount / selected.totalInvoices) * 100,
                )}%`
              : "0%"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Percentage of matched invoices
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-sm text-gray-400">Last Reconciled</p>
          <p className="text-xl font-bold text-gray-700 mt-1">
            {new Date(selected.generatedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Date of last reconciliation run
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-700 text-base">
              Invoice Detail Table
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Full breakdown for {selected.filingPeriod}
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              ✅ {selected.matchedCount} Matched
            </span>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
              ❌ {selected.mismatchedCount} Mismatched
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
              ⚠️ {selected.missingInGSTR2B} Missing
            </span>
          </div>
        </div>
        <MismatchTable data={selected.details || []} />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Reconciliation Dashboard
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Overview of your GST reconciliation results
            </p>
          </div>
          {results.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 font-medium">
                Filing Period:
              </label>
              <select
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={selected?._id || ""}
                onChange={(e) =>
                  setSelected(results.find((r) => r._id === e.target.value))
                }
              >
                {results.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.filingPeriod}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading
          ? renderLoading()
          : !selected
            ? renderEmpty()
            : renderDashboard()}
      </main>
    </div>
  );
}
