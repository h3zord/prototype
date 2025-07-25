"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CustomerProductionTime {
  time: string;
  count: number;
}

interface AvgProductionTimeByCustomer {
  [customerName: string]: CustomerProductionTime;
}

interface ProductionTimeByCustomerProps {
  data: AvgProductionTimeByCustomer;
  filters?: Record<string, any>;
}

const formatTimeLabel = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const hourLabel = h > 0 ? `${h}h` : "";
  const minuteLabel = m > 0 ? `${m}min` : "";
  return `${hourLabel}${minuteLabel}` || "0min";
};

export default function ProductionTimeByCustomer({
  data,
  filters,
}: ProductionTimeByCustomerProps) {
  const formatData = Object.entries(data).map(([name, { time, count }]) => {
    return { name, time, count };
  });

  const hasData = formatData.length > 0 && Object.keys(data).length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center w-full">
        <p className="text-gray-400 text-center text-lg">
          {filters?.statuses.includes("FINALIZED")
            ? `Não há dados disponíveis para serem exibidos.`
            : `Para a visualização das métricas o status da OS deve ser "Finalizada"`}
        </p>
      </div>
    );
  }

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
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
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
          data={formatData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="count"
        >
          {formatData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(_, name, props) => {
            return [
              `${formatTimeLabel(props.payload.time)} (${props.payload.count} OS)`,
              name,
            ];
          }}
        />
        <Legend
          formatter={(value) => {
            const entry = formatData.find((item) => item.name === value);
            return `${value} (${formatTimeLabel(entry?.time || "0:00")})`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
