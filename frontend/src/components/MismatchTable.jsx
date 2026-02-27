const statusColor = {
  MATCHED: "bg-green-100 text-green-700",
  MISMATCHED: "bg-red-100 text-red-700",
  MISSING: "bg-yellow-100 text-yellow-700",
};

export default function MismatchTable({ data }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            {[
              "Invoice No",
              "Status",
              "GSTR1 Value",
              "GSTR2B Value",
              "GST Diff (₹)",
              "Risk",
            ].map((h) => (
              <th key={h} className="px-4 py-3 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{row.invoiceNumber}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[row.status]}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3">
                ₹{row.gstr1TaxableValue?.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                ₹{row.gstr2bTaxableValue?.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-red-600 font-medium">
                ₹{row.discrepancy?.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.riskFlag === "High"
                      ? "bg-red-100 text-red-700"
                      : row.riskFlag === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : row.riskFlag === "Low"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                  }`}
                >
                  {row.riskFlag}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
