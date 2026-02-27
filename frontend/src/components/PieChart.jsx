import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RISK_COLORS = {
  None: "#22c55e",
  Low: "#3b82f6",
  Medium: "#f59e0b",
  High: "#ef4444",
};

const RADIAN = Math.PI / 180;

// Custom label inside each pie slice
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export default function PieChartComponent({ data }) {
  // data format expected:
  // [{ name: 'Low', value: 5 }, { name: 'Medium', value: 3 }, { name: 'High', value: 2 }]

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No risk data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={40}
          dataKey="value"
          nameKey="name"
          labelLine={false}
          label={renderCustomLabel}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={RISK_COLORS[entry.name] || "#94a3b8"}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            fontSize: "13px",
          }}
          formatter={(value, name) => [`${value} invoices`, `Risk: ${name}`]}
        />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: "13px", color: "#374151" }}>
              {value} Risk
            </span>
          )}
          wrapperStyle={{ paddingTop: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
