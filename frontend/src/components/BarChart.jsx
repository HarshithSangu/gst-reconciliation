import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BarChartComponent({ data }) {
  // data format expected:
  // [{ name: 'Matched', count: 10 }, { name: 'Mismatched', count: 4 }, { name: 'Missing', count: 2 }]

  const colorMap = {
    Matched: "#22c55e",
    Mismatched: "#ef4444",
    Missing: "#f59e0b",
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 13, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            fontSize: "13px",
          }}
          cursor={{ fill: "#f3f4f6" }}
        />
        <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }} />
        <Bar
          dataKey="count"
          name="Invoices"
          radius={[6, 6, 0, 0]}
          maxBarSize={60}
          fill="#3b82f6"
          // Apply per-bar color based on name
          label={false}
        >
          {data?.map((entry, index) => (
            <rect key={index} fill={colorMap[entry.name] || "#3b82f6"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
