"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ProductionByCustomerProps {
  data: Record<string, number>;
}

export default function ProductionByCustomer({
  data,
}: ProductionByCustomerProps) {
  const hasData = Object.keys(data).length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center my-auto w-full">
        <p className="text-gray-400 text-center text-lg m-auto">
          Não há dados disponíveis para serem exibidos.
        </p>
      </div>
    );
  }

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
    percentual: total > 0 ? ((value / total) * 100).toFixed(1) : "0",
  }));

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#A28FD0",
    "#FF5C8A",
    "#4BC0C0",
    "#FF6666",
    "#6ECF68",
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [
            `${value} (${props.payload.percentual}%)`,
            name,
          ]}
        />
        <Legend
          formatter={(value) => {
            const entry = chartData.find((item) => item.name === value);
            return `${value} (${entry?.value} unidades)`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
