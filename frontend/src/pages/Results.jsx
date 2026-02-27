import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MismatchTable from "../components/MismatchTable";
import api from "../api/axiosInstance";

const riskColor = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

export default function Results() {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/reconciliation/results")
      .then(({ data }) => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Reconciliation Results
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            View all past reconciliation runs
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">⏳</p>
            <p>Loading results...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📂</p>
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm mt-1">
              Upload your GSTR files and run reconciliation first.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Summary Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    {[
                      "Filing Period",
                      "Total Invoices",
                      "Matched",
                      "Mismatched",
                      "Missing",
                      "ITC Difference",
                      "Risk Level",
                      "Date",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((result) => (
                    <tr
                      key={result._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selected?._id === result._id ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-blue-700">
                        {result.filingPeriod}
                      </td>
                      <td className="px-4 py-3">{result.totalInvoices}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">
                        {result.matchedCount}
                      </td>
                      <td className="px-4 py-3 text-red-600 font-medium">
                        {result.mismatchedCount}
                      </td>
                      <td className="px-4 py-3 text-yellow-600 font-medium">
                        {result.missingInGSTR2B}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ₹{result.itcDifference?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${riskColor[result.riskLevel]}`}
                        >
                          {result.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(result.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            setSelected(
                              selected?._id === result._id ? null : result,
                            )
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            selected?._id === result._id
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {selected?._id === result._id
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded Detail Section */}
            {selected && (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Invoice Details — {selected.filingPeriod}
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {selected.details?.length} invoices in this reconciliation
                      run
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      ✅ Matched: {selected.matchedCount}
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                      ❌ Mismatched: {selected.mismatchedCount}
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                      ⚠️ Missing: {selected.missingInGSTR2B}
                    </span>
                  </div>
                </div>
                <MismatchTable data={selected.details || []} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
