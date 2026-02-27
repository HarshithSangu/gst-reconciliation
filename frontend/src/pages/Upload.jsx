import { useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axiosInstance";

const FILE_TYPES = ["GSTR1", "GSTR2B", "GSTR3B"];

export default function Upload() {
  const [fileType, setFileType] = useState("GSTR1");
  const [filingPeriod, setFilingPeriod] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !filingPeriod) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);
    formData.append("filingPeriod", filingPeriod);
    try {
      const { data } = await api.post("/upload", formData);
      setStatus(`✅ ${data.message} (${data.count} records)`);
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.message || "Upload failed"}`);
    }
    setLoading(false);
  };

  const handleReconcile = async () => {
    if (!filingPeriod) return setStatus("Please enter filing period");
    setRunLoading(true);
    try {
      const { data } = await api.post("/reconciliation/run", { filingPeriod });
      setStatus(`✅ Reconciliation complete! Risk Level: ${data.riskLevel}`);
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.message || "Reconciliation failed"}`);
    }
    setRunLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Upload GST Files
        </h2>
        <div className="max-w-lg bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Filing Period (e.g. 2024-01)
            </label>
            <input
              type="text"
              placeholder="YYYY-MM"
              className="w-full border rounded-lg px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setFilingPeriod(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              File Type
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setFileType(e.target.value)}
            >
              {FILE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Upload Excel File (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx"
              className="w-full border rounded-lg px-4 py-2 mt-1 text-sm"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
          <hr />
          <button
            onClick={handleReconcile}
            disabled={runLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-60"
          >
            {runLoading ? "Running..." : "⚡ Run Reconciliation"}
          </button>
          {status && (
            <div className="p-3 bg-gray-50 border rounded-lg text-sm text-gray-700">
              {status}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
